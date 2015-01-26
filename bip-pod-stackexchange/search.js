/**
 *
 * The Bipio Search Pod.
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

function Search(podConfig) {
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Search.prototype = {};

Search.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    $resource = this.$resource;

  this.invoke(imports, channel, sysImports, contentParts, function(err, exports) {
    if (err) {
      next(err);
    } else {
      $resource.dupFilter(exports, 'question_id', channel, sysImports, function(err, item) {
        next(err, item);
      });
    }
  });
}

Search.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	var url = "https://api.stackexchange.com/2.2/search?order=desc&sort=activity&site=" + imports.site + "&intitle=" + imports.query;
	this.$resource._httpGet(url, function(err, body, headers, statusCode) {
		if (err) {
			next(err);
		} else if (body.items) {
			for (var i = 0; i < body.items.length; i++) {
				next(false, body.items[i]);
			}
		}
	});
}

// -----------------------------------------------------------------------------
module.exports = Search;
