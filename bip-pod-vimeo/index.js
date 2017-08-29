/**
 *
 * Vimeo Actions and Content Emitters
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
VimeoAPI = require('vimeo-api').Vimeo,
Vimeo = new Pod();

Vimeo.profileReprOAuth = function(profile) {
  return profile.name;
}

Vimeo._getClient = function(sysImports) {
  var client = new VimeoAPI(
    sysImports.auth.oauth.clientID,
    sysImports.auth.oauth.clientSecret
  );

  client.access_token = sysImports.auth.oauth.token;
  client.scope = 'public private upload';
  return client;
}

// -----------------------------------------------------------------------------
module.exports = Vimeo;