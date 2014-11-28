/**
 * Copyright (c) 2010-2014 WoT.IO
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

function Validate() {}

Validate.prototype = {};

Validate.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  this.pod.getClient(sysImports, null, true)
    .request('GET', '/address/validate', { address : imports.address }, function(err, result) {
      if (!err) {
        result.local_part = result.parts.local_part;
        result.domain = result.parts.domain
      }
      next(err, result);
    });
}

// -----------------------------------------------------------------------------
module.exports = Validate;
