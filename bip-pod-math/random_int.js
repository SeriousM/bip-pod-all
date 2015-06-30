/**
 *
 * @author Michael Pearson <michael@wot.io>
 * Copyright (c) 2014-2015 wot.io inc http://wot.io
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

var math = require('mathjs')();

function RandomInt(podConfig) {}

RandomInt.prototype = {};

RandomInt.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var args = [];

  if (imports.max || 0 === imports.max) {
    args.unshift(Number(imports.max));
  }

  if (imports.min || 0 === imports.min) {
    args.unshift(Number(imports.min));
  }

  var result = math.randomInt.apply(math, args );

  next(false, {
    random_int : result
  });

}

// -----------------------------------------------------------------------------
module.exports = RandomInt;
