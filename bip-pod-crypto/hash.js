/**
 *
 * The Bipio Flow Pod.  nonce action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@bip.io>
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
var crypto = require('crypto');

function Hash() {}

Hash.prototype = {};

Hash.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  next(false, {
    hash : crypto.createHash('md5').update(imports.funnel).digest('hex')
  });
}

// -----------------------------------------------------------------------------
module.exports = Hash;