/**
 *
 * The Bipio GMail Pod.  GMail Actions and Content Emitters
 *
 * Copyright (c) 2010-2014 WoT.IO inc http://wot.io
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
gapi = require('googleapis'),
drive = gapi.drive('v2'),
https = require('https'),
Q = require('q'),
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

GMail.profileReprOAuth = function(profile) {
  return profile.displayName;
}

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
  var uid = 'me',
    auth = GMail.getOAuthClient(sysImports),
    params = {
      auth : auth,
      userId:  uid,
      q : imports.searchQuery
    };
  gmail.users.messages.list(params, function(err, body, res) {
    if (err) {
      next(err);
    } else if (body && body.message) {
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

		                  var promises = [], defer;

		                  if (body.payload && body.payload.parts) {
		                    for (var i = 0; i < body.payload.parts.length; i++) {
		                      part = body.payload.parts[i];
		                      if (part.body.size && part.body.data) {
		                        var buff = new Buffer(part.body.size);
		                        buff.write(part.body.data, 'base64');

		                        // @todo - object too large
		                        if ('text/html' === part.mimeType) {
		                       //  exports.html_body = buff.toString('utf8');
		                        } else if ('text/plain' === part.mimeType) {
		                          exports.text_body = buff.toString('utf8');
		                        }
		                      }

		                      if (part.body.attachmentId) {
		                      	defer = Q.defer();
		                      	promises.push( defer.promise );
		                    	  var dataDir = GMail.getDataDir(channel, message.id);

		                    	  (function(part, promise) {
  		                    	  GMail.saveAttachment(
			                    	  	gmail,
			                    	  	auth,
			                    	  	uid,
			                    	  	message.id,
			                    	  	part,
			                    	  	dataDir,
			                    	  	contentParts,
			                    	  	function(err, struct) {
			                    	  		if (err) {
			                    	  			promise.reject(err);
			                    	  		} else {
			                    	  			promise.resolve(struct);
			                    	  		}
			                    	  	}
		                    	  	);
		                    	  })(part, defer);
		                      }
		                    }
		                  }

		                  if (!promises.length) {
			                  next(false, exports);
			                } else {
			                	Q.all(promises).then(
			                		function(results) {
			                			var bSize = 0,
			                				contentParts = {
			                					_files : []
			                				}
			                			for (var i = 0; i < results.length; i++) {
			                				contentParts._files.push(results[i]);
			                				bSize += results[i].size ? results[i].size : 0;
			                			}
			                			next(false, exports, contentParts, bSize);
			                		},
			                		function(err) {
			                			next(err);
			                		}
		                		);
			                }
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


GMail.saveAttachment = function(gmail, auth, uid, messageId, file , dataDir, contentParts , next) {
	  var self = this;
	  var request = gmail.users.messages.attachments.get({
	        'id': file.body.attachmentId,
	        'messageId': messageId,
	        'auth':auth,
	        'userId': uid
	  }, function(err, attachment ,res ) {
	    if (err) {
		      next(err);
	    } else {

			  var options = {
				  "encoding": 'base64',
			  }

	      self.$resource.file.save(
	    	  dataDir  + file.filename,
	    	  new Buffer(attachment.data),
	    	  options,
	     		function(err, struct) {
	  	      if (err) {
	  	        next(err);
	  	      } else {
	  	        struct.name = file.filename;
	  	        next(false, struct);
	  	      }
 	    	  }
	  	    );
	      }
	  })
}


// -----------------------------------------------------------------------------
module.exports = GMail;