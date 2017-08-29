/**
 *
 * mailgun Actions and Content Emitters
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
  Client = require('mailgun-js'),
  MailGun = new Pod();

MailGun.getClient = function(sysImports, domain, publicKey) {
  var struct = {
    apiKey : sysImports.auth.issuer_token[publicKey ? 'username' : 'password']
  };

  if (domain) {
    struct.domain = domain;
  }

  return new Client(struct);
}

MailGun.rpc = function(action, method, sysImports, options, channel, req, res) {
  if (method == 'get_domains') {
    this.getClient(sysImports).request('GET', '/domains', {}, function(err, results) {
      res.status(err ? 500 : 200).send(results);
    });
  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

// -----------------------------------------------------------------------------
module.exports = MailGun;
