/**
 *
 * The Bipio Unbabel Pod
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2013 Michael Pearson https://github.com/mjpearson
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

