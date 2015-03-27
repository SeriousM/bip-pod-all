/**
 *
 * The Bipio GMail Pod.  GMail Actions and Content Emitters
 *
 * Copyright (c) 2010-2014 WoT.IO inc http://wot.io
 * @author Michael Pearson <michael@wot.io>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var Pod = require('bip-pod'),
gapi = require('googleapis'),
drive = gapi.drive('v2'),
https = require('https'),
GMail = new Pod({
  oAuthRefresh : function(refreshToken, next) {
    var c = this.getConfig();
    // @see https://developers.google.com/accounts/docs/OAuth2WebServer#refresh
    var options = {
        hostname : 'accounts.google.com',
        method : 'POST',
        path : '/o/oauth2/token',
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      },
      postBody = 'grant_type=refresh_token'
          + '&client_id=' + c.oauth.clientID
          + '&client_secret=' + c.oauth.clientSecret
          + '&refresh_token=' + refreshToken;

    // @todo migrate into pod/request
    var req = https.request(options, function(res) {
      var bodyTxt = '';

      res.on('data', function(d) {
        bodyTxt += d.toString();
      });

      res.on('end', function(d) {
        if (200 === res.statusCode) {
          next(false, JSON.parse(bodyTxt));
        } else {
          next(res.statusCode + ':' + d);
        }
      })
    });

    req.write(postBody);
    req.end();

    req.on('error', function(e) {
      next(e);
    });
  }
});

GMail.BTOA = function(str) {
  var buf;

  if (str instanceof Buffer) {
    buf = str;
  } else {
    buf = new Buffer(str.toString(), 'binary');
  }
  return buf.toString('base64');
}

GMail.getOAuthClient = function(sysImports) {
  var OAuth2 = gapi.auth.OAuth2Client ? gapi.auth.OAuth2Client : gapi.auth.OAuth2,
    oauth2Client = new OAuth2();

  oauth2Client.credentials = {
    access_token : sysImports.auth.oauth.access_token
  };
  return oauth2Client;
}

GMail._invoker = function(gmail, imports, channel, sysImports, contentParts, next) {
console.log("imports.searchQuery"+imports.searchQuery);
	    uid = 'me',
	    auth = GMail.getOAuthClient(sysImports),
	    params = {
	      auth : auth,
	      userId:  uid,
	      q : imports.searchQuery
	    };
	  gmail.users.messages.list(params, function(err, body, res) {
	    if (err) {
	      next(err);
	    } else {
	    	for (var i = 0; i < body.messages.length; i++) {

	        next(false, body.messages[i]);
	      }
	    }
	  });
}

GMail._parseEmails = function(gmail, imports, channel, sysImports, contentParts, next, specificEmail) {
	  var self = this;
	  var  uid = 'me',
	    auth = GMail.getOAuthClient(sysImports);

	    $resource = this.$resource;
	    GMail._invoker(gmail, imports, channel, sysImports, contentParts, function(err, message) {
	    if (err) {
	      next(err);
	    } else {
	    	 $resource.dupFilter(message, 'id', channel, sysImports, function(err, message) {
	        var params = {};
	        if (err) {
	          next(err);
	        } else {

	          // fetch mail if it's not a dup
	          params.auth = auth;
	          params.userId = uid;
	          params.id = message.id;

	          self.limitRate(
	          	channel,
	          	(function(params, next) {
		            return function() {
		              gmail.users.messages.get(params, function(err, body, res) {
		                if (err) {
		                  next(err);
		                } else {
		                  var exports = {
		                      mimeType : body.payload.mimeType
		                    },
		                    header,
		                    part;

		                  // export headers
		                  for (var i = 0; i < body.payload.headers.length; i++) {
		                    header = body.payload.headers[i];
		                    exports[header.name] = header.value;
		                  }

		                  if(specificEmail){
		                	     //check if sent from the specific email
		                      var fromStr = ' ';
		                      if (exports.From) {
		                        fromStr += exports.From + ' ';
		                      }

		                      if (exports['Reply-To']) {
		                        fromStr += exports['Reply-To'];
		                      }

		                      if( fromStr.toLowerCase().indexOf(imports.from_id.toLowerCase()) === -1) {
		                    	  return;
		                      }
		                  }

		                  if (body.payload && body.payload.parts) {
		                    for (var i = 0; i < body.payload.parts.length; i++) {
		                      part = body.payload.parts[i];
		                      if (part.body.size && part.body.data) {
		                        var buff = new Buffer(part.body.size);
		                        buff.write(part.body.data, 'base64');
		                        // @todo - object too large
		                        if ('text/html' === part.mimeType) {
	//	                          exports.html_body = buff.toString('utf8');
		                        } else if ('text/plain') {
		                          exports.text_body = buff.toString('utf8');
		                        }
		                      } else if (part.body.attachmentId) {
		                          // @todo - get file
		                      }
		                    }
		                  }
		                  next(false, exports);
		                }
		              });
		            }
	          	})(params, next)
          	);
	        }
	      });
	    }
	  });

	}



// -----------------------------------------------------------------------------
module.exports = GMail;