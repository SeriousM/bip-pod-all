/**
 *
 * pushbullet Actions and Content Emitters
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
https = require('https'),
PushBullet = new Pod();

PushBullet.pushbulletRequest = function(path, params, sysImports, next, method) {
  var opts = {
    host: 'api.pushbullet.com',
    port: 443,
    path: '/v2/' + path,
    method: method || 'GET',
    headers : {
      'Authorization' : 'Bearer ' + sysImports.auth.issuer_token.username
    }
  }, paramStr;

  if ('POST' === method && params) {
    paramStr = JSON.stringify(params);
    opts.headers['Content-Type'] = 'application/json';
    opts.headers['Content-Length'] = paramStr.length;
  }

  var req = https.request(opts, next);

  if ('POST' === method) {
    req.write(paramStr);
  }

  req.end();
}

PushBullet.pushbulletRequestParsed = function(path, params, sysImports, next, method) {
  this.pushbulletRequest(path, params, sysImports, function(res) {
    res.setEncoding('utf8');
    var data = "";
    res.on('data', function(d) {
      data += d;
    });
    res.on("end", function() {

      if(res.statusCode !== 200) {
        next(data);
      } else {
        try {
          next(false, JSON.parse(data));
        } catch (e) {
          next(e.message);
        }
      }
    });
  }, method);
}

PushBullet.rpc = function(action, method, sysImports, options, channel, req, res) {
  var pod = this.pod;

  if (method == 'my_devices') {
    this.pushbulletRequest('devices', {}, sysImports, function(pRes) {
      pRes.pipe(res);
    });
  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

// -----------------------------------------------------------------------------
module.exports = PushBullet;
