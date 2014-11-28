/**
 *
 * @author Scott Tuddenhman <scott@wot.io>
 * Copyright (c) 2010-2014 WoT.IO Inc http://wot.io
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
function Address() {}

Address.prototype = {};

Address.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  this.pod.client.getAddress(imports.address, function(err, resp) {
      console.log(resp);
      next(err || resp.status_code !== 200, resp.data, contentParts, 0);
  });
}
// -----------------------------------------------------------------------------
module.exports = Address;
