/**
 *
 * The Bipio Idonethis Pod.  teams action definition
 * ----------------------------------------------------------------------
 *
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



function Teams(podConfig) {
	this.podConfig = podConfig; 
}


Teams.prototype = {};


Teams.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

	var url = this.getApiUrl() + 'teams/';
  
	this.$resource._httpGet(
		url,
		function(err, resp, headers, statusCode) {
			if (err) {
				next(err);
			} else {
				for (var i = 0; i < resp.results.length; i++) {
					next(false, resp.results[i])
				}
			}
		},
		{
			'Authorization' : 'TOKEN ' + sysImports.auth.issuer_token.username
		}
	);
}

// -----------------------------------------------------------------------------
module.exports = Teams;
