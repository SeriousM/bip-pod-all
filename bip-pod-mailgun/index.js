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
  MailGun = new Pod({
    name : 'mailgun', // pod name (action prefix)
    title : 'MailGun', // short description
    description : '<a href="https://mailgun.com" target="_blank">MailGun</a> - Powerful APIs that allow you to send, receive and track email effortlessly. Send 10,000 emails for free every month',
    authType : 'issuer_token',
    authMap : {
      password : 'API Key'
    },
    "renderers" : {
      'get_domains' : {
        description : 'Get Domains',
        contentType : DEFS.CONTENTTYPE_JSON
      }
    }
  });

MailGun.getClient = function(sysImports, domain) {
  return new Client({
    apiKey : sysImports.auth.issuer_token.password,
    domain : domain
  });

}

// Include any actions
MailGun.add(require('./bounced.js'));
MailGun.add(require('./complaints.js'));
MailGun.add(require('./send.js'));
MailGun.add(require('./unsubscribed.js'));
MailGun.add(require('./validate.js'));

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
