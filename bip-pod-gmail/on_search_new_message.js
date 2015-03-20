/**
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
var gapi = require('googleapis'),
  gmail = gapi.gmail({ version : 'v1' });

function OnNewSearchMessage() {}

OnNewSearchMessage.prototype = {};

OnNewSearchMessage.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    uid = 'me',
    auth = self.pod.getOAuthClient(sysImports),
    $resource = this.$resource,
    rateLimit = 100, // gmail api limit is 250/sec/user.  This should ultimately requeue on
    queue = [],
    popper;

  this.invoke(imports, channel, sysImports, contentParts, function(err, message) {
    if (err) {
      next(err);
    } else {

      $resource.dupFilter(message, 'id', channel, sysImports, function(err, message) {
        var params = {};

        if (err) {
          next(err);
        } else {

          if (!popper) {
            popper = setInterval(function() {
              if (queue.length) {
                queue.pop()();
              } else {
                clearInterval(popper);
              }

            }, 1000 / rateLimit);
          }

          // fetch mail if it's not a dup
          params.auth = auth;
          params.userId = uid;
          params.id = message.id;

          queue.push((function(params, next) {
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

                  if (body.payload && body.payload.parts) {
                    for (var i = 0; i < body.payload.parts.length; i++) {
                      part = body.payload.parts[i];
                      if (part.body.size && part.body.data) {
                        var buff = new Buffer(part.body.size);
                        buff.write(part.body.data, 'base64');

                        // @todo - object too large
                        if ('text/html' === part.mimeType) {
//                          exports.html_body = buff.toString('utf8');
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
          })(params, next));
        }
      });
    }
  });
}

OnNewSearchMessage.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    uid = 'me',
    auth = self.pod.getOAuthClient(sysImports),
    params = {
      auth : auth,
      userId:  uid,
      q : imports.q
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

// -----------------------------------------------------------------------------
module.exports = OnNewSearchMessage;