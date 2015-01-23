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



function NewDone(podConfig) {
  this.podConfig = podConfig; 
}

NewDone.prototype = {};

NewDone.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  var self = this;
	

  if (method === 'new_done') {
    res.contentType(self.pod.getActionRPC(self.name, method).contentType);
    res.send(req.query.message);
  } else {
    res.send(404);
  }

}


NewDone.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

	var resource = this.$resource;
	var done = {
		"raw_text": imports.raw_text,
		"team": imports.team
	}

    var url = API_URL + 'dones/';
	resource._httpPost(
		url,
		done,
		function(err,  body) {
			console.log(body.errors);
			if (body.errors) {
				next(body.message)
			} else {
				next(err, body);
			}
		},
		{
    		'Authorization' : 'TOKEN ' + sysImports.auth.issuer_token.username
		}
	);
}

// -----------------------------------------------------------------------------
module.exports = NewDone;
