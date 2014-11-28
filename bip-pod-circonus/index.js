/**
 *
 * Circonus Actions and Content Emitters
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
	https = require('https'),
  Circonus = new Pod();

var apiBaseURL = 'https://api.circonus.com/v2'

Circonus.apiGetRequest = function(path, sysImports, next) {
  this.$resource._httpGet(
    apiBaseURL + path,
    next,
    {
      "Accept" : "application/json",
      "Authorization" : 'Basic '
        + new Buffer(
          sysImports.auth.issuer_token.username
          + ':'
          + sysImports.auth.issuer_token.password
        ).toString('base64')
    }
	);
}

Circonus.testCredentials = function(struct, next) {
  this.apiGetRequest(
    '/user/current',
    {
      auth : {
        issuer_token : {
          username : struct.username,
          password : struct.password
        }
      }
    },
    function(err, resp, headers, statusCode) {
    	if (err) {
    		next(err, 500);
    	} else if (200 !== statusCode) {
    		next(resp.message, statusCode);
    	} else {
    		next();
    	}
    }
  );
}

// -----------------------------------------------------------------------------
module.exports = Circonus;
