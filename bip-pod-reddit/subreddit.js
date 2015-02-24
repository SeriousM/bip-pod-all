/**
 *
 * The Bipio Reddit Pod.  /r/ 'subreddit' action definition
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

function Subreddit(podConfig) {
  this.podConfig = podConfig;
}

Subreddit.prototype = {};


Subreddit.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
	var $resource = this.$resource;

	this.invoke(imports, channel, sysImports, contentParts, function(err, listing) {
		if (err) {
			next(err);
		} else {
			$resource.dupFilter(listing, 'id', channel, sysImports, function(err, listing) {
				next(err, listing);
			});
		}
	});

}


Subreddit.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	var url = 'http://www.reddit.com/r/' + imports.subreddit + '/.json';
	this.$resource._httpGet(
		url,
		function(err, resp, headers, statusCode) {
			if (err || resp.data.children == 'undefined') {
				next(err);
			} else {
				_.forEach(resp.data.children, function(sub) {
					sub.data.permalink = 'http://www.reddit.com' + sub.data.permalink;
					next(false, sub.data);
				});
			}
		}
	);
}

// -----------------------------------------------------------------------------
module.exports = Subreddit;
