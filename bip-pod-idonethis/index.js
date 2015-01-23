/**
 *
 * Idonethis Pod for Bip.IO
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

var BASE_URL = 'https://idonethis.com/';
var API_VERSION = 'v0.1'
var API_URL = BASE_URL + 'api/' + API_VERSION + '/';


var Pod = require('bip-pod'),
    Idonethis = new Pod();


Idonethis.rpc = function(action, method, sysImports, options, channel, req, res) {

  if (method == 'teams') {

	// call 'teams' api endpoint...
	var get = this.$resource._httpGet,
		url = API_URL + 'teams/';
	get(
		url,
		function(err, resp, headers, statusCode) {
			res.status(err? 500 : 200).send(resp);
		},
		{
		'Authorization' : 'TOKEN ' + sysImports.auth.issuer_token.username
		}
	);


  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

// -----------------------------------------------------------------------------
module.exports = Idonethis;
