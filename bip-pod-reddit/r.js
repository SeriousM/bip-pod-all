/**
 *
 * The Bipio Reddit Pod.  r 'subreddit' action definition
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

function R(podConfig) {
  this.podConfig = podConfig; 
}

R.prototype = {};


R.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

	var subr = {};
	var url = 'http://www.reddit.com/r/' + imports.subreddit + '/.json';

	this.$resource._httpGet(
		url, 
		function(err, resp, headers, statusCode) {
			if (err) {
				next(err);
			} else {
				if (resp.data.children == 'undefined') {
					next(err);
				} else {
					_.forEach(resp.data.children, function(sub) {
						subr.author = sub.data.author;
						subr.title = sub.data.title;
						subr.url = sub.data.url;
						subr.permalink = 'http://www.reddit.com' + sub.data.permalink;
						subr.created = sub.data.created;
						subr.ups = sub.data.ups;
						next(false, subr); 
					});
				}
			}
		}
	);
}

// -----------------------------------------------------------------------------
module.exports = R;
