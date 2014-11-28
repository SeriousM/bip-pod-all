/**
 *
 * mailgun Actions and Content Emitters
 *
 * @author Michael Pearson <michael@bip.io>
 * Copyright (c) 2010-2014 WoT.IO
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
