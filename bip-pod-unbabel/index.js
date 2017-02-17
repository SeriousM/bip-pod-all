/**
 *
 * The Bipio Unbabel Pod
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
  Unbabel = new Pod();

Unbabel.requestPOST = function(method, payload, sysImports, next) {
  var config = this.getConfig();

//  console.log(config.url + '/tapi/v2/' + method);
//  console.log(payload);

  this._httpPost(
    config.url + '/tapi/v2/' + method + '/',
    payload,
    next,
    {
      'Authorization' : 'ApiKey '
        + sysImports.auth.issuer_token.username
        + ':'
        + sysImports.auth.issuer_token.password
    }
  );
}

Unbabel.requestGET = function(method, args, sysImports, next) {
  var config = this.getConfig(),
    getReq = '?';

  for (var a in args) {
    if (args.hasOwnProperty(a)) {
      getReq += a + '=' + args[a] + '&';
    }
  }

  this._httpGet(
    config.url + '/tapi/v2/' + method + '/' + getReq,
    next,
    {
      'Authorization' : 'ApiKey '
        + sysImports.auth.issuer_token.username
        + ':'
        + sysImports.auth.issuer_token.password
    }
  );
}

// -----------------------------------------------------------------------------
module.exports = Unbabel;

