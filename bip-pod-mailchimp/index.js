/**
 *
 * The Bipio MailChimp Pod
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
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
