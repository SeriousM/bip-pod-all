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

function Get_statistics(podConfig) {

}

Get_statistics.prototype = {};

Get_statistics.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.pod.$resource,
    url = 'http://gdata.youtube.com/feeds/api/users/' + imports.username + '?alt=json';

  $resource._httpGet(url, function(err, body) {
console.log(body);
    next(err, body.entry['yt$statistics'] );
  });

  next( false, {} );
}

// -----------------------------------------------------------------------------
module.exports = Get_statistics;
