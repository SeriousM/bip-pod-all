/**
 *
 * The Bipio Hall Pod.  group_message action definition
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

function Group_message(podConfig) {
}

Group_message.prototype = {};

Group_message.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  this.$resource._httpPost(
      imports.url,
      imports,
      function(err, resp, headers) {
        next(err, { status : headers.status });
      }
    );
}

// -----------------------------------------------------------------------------
module.exports = Group_message;
