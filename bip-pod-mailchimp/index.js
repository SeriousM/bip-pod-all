/**
 *
 * The Bipio MailChimp Pod
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
MailChimpAPI = require('mailchimp').MailChimpAPI,
MailChimp = new Pod();

MailChimp.rpc = function(action, method, sysImports, options, channel, req, res) {
  if (method == 'get_lists') {
    this.getList(sysImports, function(err, results) {
      if (err) {
        res.send(err, 500);
      } else {
        res.send(results);
      }
    });
  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

MailChimp.profileReprOAuth = function(profile) {
  return profile.login.login_name + ' - ' + profile.accountname;
}

MailChimp.getAPI = function(sysImports) {
  // fudge the api key for the mailchimp package.
  // need to inject
  var api = new MailChimpAPI(
      ' -' + (sysImports.auth.oauth.dc || JSON.parse(sysImports.auth.oauth.profile).dc),
      {
        version : '2.0'
    }
  );
  api.apiKey = sysImports.auth.oauth.access_token;
  return api;
}

MailChimp.callMC = function(section, method, args, sysImports, next) {
  this.getAPI(sysImports).call(section, method, args, next);
}

MailChimp.getList = function(sysImports, next) {
  var api = this.getAPI(sysImports);

  api.call('lists', 'list', {
    apikey : sysImports.auth.oauth.token
  }, next);
}

// -----------------------------------------------------------------------------
module.exports = MailChimp;
