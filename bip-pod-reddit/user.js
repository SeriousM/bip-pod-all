/**
 *
 * The Bipio Reddit Pod.  user action definition
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

var _ = require('lodash');

function User(podConfig) {
  this.podConfig = podConfig; 
}

User.prototype = {};

User.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

	var listing = {};
	var url = 'http://www.reddit.com/u/' + imports.username + '/.json';

	this.$resource._httpGet(
		url, 
		function(err, resp, headers, statusCode) {
			if (err) {
				next(err);
			} else {
				if (resp.data.children == 'undefined') {
					next(err);
				} else {
					_.forEach(resp.data.children, function(item) {
						listing.author = item.data.author;
						listing.body = item.data.body;
						listing.link_url = item.data.link_url;
						listing.created = item.data.created;
						listing.ups = item.data.ups;
						listing.id = item.data.id;
						next(false, listing); 
					});
				}
			}
		}
	);
}




// -----------------------------------------------------------------------------
module.exports = User;
