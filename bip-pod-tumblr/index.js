/**
 *
 * The Bipio Tumblr Pod.  Tumblr Actions and Content Emitters
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
tumblr = require('tumblr.js'),
Tumblr = new Pod();

Tumblr.profileReprOAuth = function(profile) {
  return profile.response.user.name;
}

Tumblr.getClient = function(sysImports) {
  return new tumblr.Client({
    consumer_key : sysImports.auth.oauth.consumerKey,
    consumer_secret : sysImports.auth.oauth.consumerSecret,
    token : sysImports.auth.oauth.access_token,
    token_secret : sysImports.auth.oauth.secret
  });
}

Tumblr.rpc = function(action, method, sysImports, options, channel, req, res) {
  var podConfig = this.getConfig();
  if (method == 'user_info') {
    var client = this.getClient(sysImports);

    client.userInfo(function(err, resp) {
      if (err) {
        res.send(err, 500);
      } else {
        res.send(resp);
      }
    });

  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

Tumblr._createPost = function(type, imports, channel, sysImports, contentParts, next) {
  var log = this.log,
    defaultFormat = sysImports.auth.oauth.default_post_format || JSON.parse(sysImports.auth.oauth.profile).response.user.default_post_format;

  var client = this.getClient(sysImports);

  imports.state = (imports.state && '' !== imports.state) ?
    imports.state :
    'draft';

  imports.format = (imports.format && '' !== imports.format) ?
    imports.format :
    defaultFormat;

  var url = imports.url;

  if (-1 === url.indexOf('.')) {
    url += '.tumblr.com';
  }

  client[type](url, imports, function(err, response) {
    if (err) {
      log(err, channel, 'error');
    }
    next(err, response);
  });
}

// -----------------------------------------------------------------------------
module.exports = Tumblr;

