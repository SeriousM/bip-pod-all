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


var BASE_URL = 'https://idonethis.com/';
var API_VERSION = 'v0.1'
var API_URL = BASE_URL + 'api/' + API_VERSION + '/';



function Dones(podConfig) {
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Dones.prototype = {};

// RPC/Renderer accessor - /rpc/render/channel/{channel id}/hello
Dones.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  var self = this;
	

  if (method === 'dones') {
    res.contentType(self.pod.getActionRPC(self.name, method).contentType);
    res.send(req.query.message);
  } else {
    res.send(404);
  }

}


Dones.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {


var get = this.$resource._httpGet,
    url = API_URL + 'dones/';

	if (imports.team) {
		url = url + '&team=' + imports.team;
	} 
	if (imports.tags) {
		var tags = imports.tags.replace(/\s+/g,'');
		url = url + '&tags=' + tags;
	} 
	// TODO: ability to filter on all additional filter types...


  get(
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
