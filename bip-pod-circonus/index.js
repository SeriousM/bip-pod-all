/**
 *
 * Circonus Actions and Content Emitters
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
  Circonus = new Pod();

var apiBaseURL = 'https://api.circonus.com/v2'

Circonus.apiGetRequest = function(path, sysImports, next) {
  this.$resource._httpGet(
    apiBaseURL + path,
    next,
    {
      "Accept" : "application/json",
      "Authorization" : 'Basic '
        + new Buffer(
          sysImports.auth.issuer_token.username
          + ':'
          + sysImports.auth.issuer_token.password
        ).toString('base64')
    }
	);
}

Circonus.testCredentials = function(struct, next) {
  this.apiGetRequest(
    '/user/current',
    {
      auth : {
        issuer_token : {
          username : struct.username,
          password : struct.password
        }
      }
    },
    function(err, resp, headers, statusCode) {
    	if (err) {
    		next(err, 500);
    	} else if (200 !== statusCode) {
    		next(resp.message, statusCode);
    	} else {
    		next();
    	}
    }
  );
}

// -----------------------------------------------------------------------------
module.exports = Circonus;
