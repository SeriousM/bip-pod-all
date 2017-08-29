/**
 *
 * The Bipio Alchemy Pod.  Alchemy Actions and Content Emitters
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
  request = require('request'),
  Alchemy = new Pod();

Alchemy.post = function(method, params, sysImports, next) {
  var args = {
  };

  for (var k in params) {
    if (params.hasOwnProperty(k)) {
      args[k] = params[k];
    }
  }

  params.apikey = sysImports.auth.issuer_token.password;
  params.outputMode = 'json';

  request.post(
    'http://access.alchemyapi.com/calls/' + method,
    {
      form : params
    },
    function(err, res, body) {
      if (err) {
        next(err);
      } else {
        try {
          body = JSON.parse(body);
          if ('ERROR' === body.status) {
            var msg = body.statusInfo;

            if (body.usage) {
              msg += ':' + body.usage;
            }

            next(msg);
          } else {
              next(false, body);
          }
        } catch (e) {
          next(e.message);
        }
      }
    }
  );
}

// -----------------------------------------------------------------------------
module.exports = Alchemy;
