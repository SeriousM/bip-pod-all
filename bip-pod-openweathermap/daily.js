/**
 *
 * The Bipio Daily Pod.  
 * ---------------------------------------------------------------
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

var weather = require('openweathermap');

weather.defaults =  {
    units:'metric', 
    lang:'en', 
    mode:'json'
}

function Daily(podConfig) {
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Daily.prototype = {};

// RPC/Renderer accessor - /rpc/render/channel/{channel id}/hello
Daily.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  var self = this;
	

  if (method === 'echo') {
    res.contentType(self.pod.getActionRPC(self.name, method).contentType);
    res.send(req.query.message);
  } else {
    res.send(404);
  }

}

/**
 * Action Invoker - the primary function of a channel
 *
 * @param Object imports transformed key/value input pairs
 * @param Channel channel invoking channel model
 * @param Object sysImports
 * @param Array contentParts array of File Objects, key/value objects
 * with attributes txId (transaction ID), size (bytes size), localpath (local tmp file path)
 * name (file name), type (content-type), encoding ('binary')
 *
 * @param Function next callback(error, exports, contentParts, transferredBytes)
 *
 */
Daily.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	var count = imports.cnt ? imports.cnt : 3;
	if (imports.q) {
			weather.daily({q : imports.q, cnt : count}, function(err, cb) {
				if (err) {
				next(err);
				} else {
				next(false, cb);
				}
			}); 
	}
}

// -----------------------------------------------------------------------------
module.exports = Daily;
