/**
 *
 * The Bipio Idonethis Pod.  dones action definition
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


function Dones(podConfig) {
	this.podConfig = podConfig; // general system level config for this pod (transports etc)
}


Dones.prototype = {};


Dones.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
	var self = this,
    	$resource = this.$resource;

	this.invoke(imports, channel, sysImports, contentParts, function(err, exports) {
    	if (err) {
    		next(err);
    	} else {
    		$resource.dupFilter(exports, 'id', channel, sysImports, function(err, done) {
				next(err, done);
			});
    	}
	});
}


Dones.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

    var url = this.getApiUrl() + 'dones/';

	if (imports.team) {
		url = url + '&team=' + imports.team;
	} 
	if (imports.tags) {
		var tags = imports.tags.replace(/\s+/g,'');
		url = url + '&tags=' + tags;
	} 

	this.$resouce._httpGet(
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
module.exports = Dones;
