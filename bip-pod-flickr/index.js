/**
 *
 * The Bipio Flickr Pod.
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
  Flickr = require('flickrapi');

FlickrPod = new Pod();

FlickrPod.getClient = function(sysImports, next) {
  var podConfig = this.getConfig(),
    profile = JSON.parse(sysImports.auth.oauth.profile)
    options = {
      user_id : profile.id,
      api_key : sysImports.auth.oauth.consumerKey,
      secret : sysImports.auth.oauth.consumerSecret,
      access_token : sysImports.auth.oauth.access_token,
      access_token_secret : sysImports.auth.oauth.secret,
      nobrowser : true
    };
console.log(options);
  Flickr.authenticate(options, next);
};

// -----------------------------------------------------------------------------
module.exports = FlickrPod;
