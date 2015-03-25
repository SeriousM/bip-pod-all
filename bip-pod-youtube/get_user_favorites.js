/**
 *
 * The Bipio Youtube Pod.  get_statistics action definition
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

function GetUserFavorites(podConfig) {
}

GetUserFavorites.prototype = {};

GetUserFavorites.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
    var $resource = this.$resource;
    this.invoke(imports, channel, sysImports, contentParts, function(err, video) {
    	var exports = {};
    	exports['id'] = video['id']['$t'];
    	exports['published'] = video['published']['$t'];
    	exports['updated'] = video['updated']['$t'];
    	exports['title'] = video['title']['$t'];
    	exports['content'] = video['content']['$t'];
    	exports['link'] = video['link'][0]['href'];

        $resource.dupFilter(exports, 'id', channel, sysImports, function(err, favorite) {
            next(err, favorite);
        });
    });
}

GetUserFavorites.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	var $resource = this.pod.$resource;
	url = 'http://gdata.youtube.com/feeds/api/users/' + imports.username + '/favorites?alt=json';
     $resource._httpGet(url, function(err, body) {
     	 for (var i = 0; i < body.feed.entry.length; i++) {
     		 next(err, body.feed.entry[i]);
     	 }
     });
    
}

// -----------------------------------------------------------------------------
module.exports = GetUserFavorites;
