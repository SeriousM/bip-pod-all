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

var Pod = require('bip-pod'),
    Idonethis = new Pod();


Idonethis.testCredentials = function(struct, next) {

	var url = this.getApiUrl() + 'noop';

	this.$resource._httpGet(
		url,
		function(err, resp, headers, statusCode) {
			if (err) {
				next(err, 500);
			} else if (statusCode == 200) {
				next(false, 200);
			}
		},
		{
			'Authorization' : 'TOKEN ' + struct.username
		}
	);
}


// TODO pass sysImports as param in order to inject auth header.
// TODO wrap _httpGet fn call as base level API getter.
Idonethis.getApiUrl = function() {

	var BASE_URL = 'https://idonethis.com/api/';
	var API_VERSION = this.getSchema().version;
	var API_URL = BASE_URL + API_VERSION + '/';

	return API_URL;
}


Idonethis.rpc = function(action, method, sysImports, options, channel, req, res) {

	if (method == 'teams') {

		var url = this.getApiUrl() + 'teams/';

		this.$resource._httpGet(
			url,
			function(err, resp, headers, statusCode) {
				res.contentType(pod.getRPCs('teams').contentType);
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
