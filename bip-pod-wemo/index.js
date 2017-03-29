/**
 *
 * nest Actions
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Pod = require('bip-pod'),
    Nest = new Pod();

var https = require('https'),
queryString = require('querystring'),
url = require('url'),
util = require('util'); 

//var defaultNestUserAgent = 'Nest/3.0.15 (iOS) os=6.0 platform=iPad3,1';
var defaultNestUserAgent='Nest/3.0.15 (iOS) os=6.0 platform=iPad3,1';
var nestSession = {}, nestStatus={};

/* always call login first. :)  */
/**
 * Login to the Nest thermostat.
 * @param {String} username Your Nest user name.
 * @param {String} password Your nest password.
 * @param {Function} done Callback to be called when login is complete.
 */

Nest.fahrenheitToCelsius = function (f) {
    return (f - 32) * 5 / 9.0;
};

Nest.celsiusToFahrenheit = function (c) {
    return Math.round(c * (9 / 5.0) + 32.0);
};

Nest.merge=function(o1, o2) {
    o1 = o1 || {};
    if (!o2) {
        return o1;
    }
    for (var p in o2) {
        o1[p] = o2[p];
    }
    return o1;
};



Nest.login = function (username, password, done) {
    this.nestPost({
      hostname: 'home.nest.com',
      port: 443,
      path:'/user/login',
      body: { 'username': username, 'password': password },
      done: function(data) {
          if (data.error) {
              if (typeof done === 'function') {
                  done(new Error(data.error_description), null);
              }
          } else {
              nestSession = data;
              nestSession.urls.transport_url = url.parse(nestSession.urls.transport_url);

              if (typeof done === 'function') {
                  done(null, data);
              }
          }
      }
  });
};

// Post data to Nest.
// Settings object
//   {
//      hostname: string, usually set to the transport URL (default)
//      port: defaults to 443, override here
//      path : string
//      body : string or object, if string, sent as is
//              if object, converted to form-url encoded
//              if body is string, content-type is auto set to
//              application/json
//              otherwise, set to urlencoded
//              override this value with the headers param if
//              needed
//      headers: { headerName: Value }
//      done: callback function
//   }
Nest.nestPost = function (settings) {
    var allData = [];
    var post_data;
    var contentType;
    var hostname, port, path, body, headers, done;

    if (typeof settings === 'function') {
        // call the function and get the results, which
        // MUST be an object (so that it's processed below)
        settings = settings();
    }

    if (settings && typeof settings === 'object') {
        hostname = settings.hostname || nestSession.urls.transport_url.hostname;
        port = settings.port || nestSession.urls.transport_url.port;
        path = settings.path;
        body = settings.body || null;
        headers = settings.headers;
        done = settings.done;
    } else {
        throw new Error("Settings I need to function properly!");
    }

    // convert to a form url encoded body
    if (typeof body !== 'string') {
        post_data = queryString.stringify(body);
        contentType = 'application/x-www-form-urlencoded; charset=utf-8';
    } else {
        post_data = body;
        contentType = 'application/json';
    }
    var options = {
        host:hostname,
        port:port,
        path:path,
        method:'POST',
        headers:{
            'Content-Type':contentType,
            'User-Agent':defaultNestUserAgent,
            'Content-Length':post_data.length
        }
    };

    if (headers) {
        options.headers = this.merge(options.headers, headers);
    }

    // if we're already authorized, add the necessary stuff....
    if (nestSession && nestSession.access_token) {
        options.headers =  this.merge(options.headers, {
            'X-nl-user-id':nestSession.userid,
            'X-nl-protocol-version':'1',
            'Accept-Language':'en-us',
            'Authorization':'Basic ' + nestSession.access_token
        });
    }
    var request = https.request(options,
        function (response) {

            response.setEncoding('utf8');
            response.on('data', function (data) {
                allData.push(data);
            });
            response.on('error', function () {
                if (done) {
                    done(null, response.headers || {});
                }
            });
            response.on('end', function () {
                // convert all data
                allData = allData.join('');
                if (allData && typeof allData === 'string') {
                    allData = JSON.parse(allData);
                }
                if (done) {
                    done(allData, response.headers || {});
                }
            });


        });
    request.write(post_data);
    request.end();

};

Nest.nestGet = function (path, done) {
    var allData = [];

    var options = {
        host:nestSession.urls.transport_url.hostname,
        port:nestSession.urls.transport_url.port,
        path:path,
        method:'GET',
        headers:{
            'User-Agent':defaultNestUserAgent,
            'X-nl-user-id':nestSession.userid,
            'X-nl-protocol-version':'1',
            'Accept-Language':'en-us',
            'Authorization':'Basic ' + nestSession.access_token
        }
    };
    
    var request = https.request(options,
        function (response) {

            response.setEncoding('utf8');
            response.on('data', function (data) {
                allData.push(data);
            });
            response.on('end', function () {
                // convert all data
                allData = allData.join('');

                if (allData && typeof allData === 'string' && allData.length > 0) {
                    allData = JSON.parse(allData);
                } else {
                    allData = null;
                }
                if (done) {
                    done(allData);
                }

            });
        });
    request.end();
};


Nest.fetchCurrentStatus = function (done) {
    this.nestGet('/v2/mobile/' + nestSession.user, function (data) {
        if (!data) {
            console.log('unable to retrieve status');
            return;
        }
        
        nestStatus.lastStatus = data;
        if (done) {
            done(data);
        }


    });
};



Nest.setTemperature = function (deviceId, tempC) {

    // likely passed in a F temp, so just convert it.
    if (tempC > 45) {
        tempC = this.fahrenheitToCelsius(tempC);
    }

    var body = {
        'target_change_pending':true,
        'target_temperature':tempC
    };

    body = JSON.stringify(body);
    var headers = {
        'X-nl-base-version':nestStatus.lastStatus['shared'][deviceId]['$version'],
        'Content-Type':'application/json'
    };

    this.nestPost({
        path:'/v2/put/shared.' + deviceId,
        body:body,
        headers:headers,
        done:function (data) {
            console.log('Set temperature');
        }
    });
};
// -----------------------------------------------------------------------------
module.exports = Nest;
