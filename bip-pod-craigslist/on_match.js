/**
 *
 * @author Michael Pearson <michael@bip.io>
 * Copyright (c) 2010-2015 WoT.IO
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

function OnMatch() {}

OnMatch.prototype = {};

OnMatch.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource;

  this.invoke(imports, channel, sysImports, contentParts, function(err, listing) {
    if (err) {
      next(err);
    } else {
      $resource.dupFilter(listing, 'pid', channel, sysImports, function(err, listing) {
        next(err, listing);
      });
    }
  });
}

OnMatch.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var opts = {
    city : imports.city.replace(/\s*/g, '')
  }

  if (imports.min) {
    opts.minAsk = imports.min;
  }

  if (imports.max) {
    opts.maxAsk = imports.max;
  }

  this.pod.search(imports.query, opts, function(err, listings) {
    if (err) {
      next(err);
    } else {
      for (var i = 0; i < listings.length; i++) {
        next(false, listings[i]);
      }
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = OnMatch;
