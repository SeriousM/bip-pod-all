/**
 *
 * keenio Actions and Content Emitters
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
  Keen = require('keen-js'),
  KeenIO = new Pod();

KeenIO.getClient = function(sysImports, projectId) {
  return new Keen({
    projectId : projectId,
    writeKey : sysImports.auth.issuer_token.password,
    readKey : sysImports.auth.issuer_token.username,
	protocol : 'https',
	host : 'api.keen.io/3.0'
  });
}

// -----------------------------------------------------------------------------
module.exports = KeenIO;
