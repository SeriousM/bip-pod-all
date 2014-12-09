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

function Unsubscribed() {}

Unsubscribed.prototype = {};

Unsubscribed.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource;
  this.invoke(imports, channel, sysImports, contentParts, function(err, exports) {
    if (err) {
      next(err);
    } else {
      $resource.dupFilter(exports, 'address', channel, sysImports, function(err, addr) {
        next(err, addr);
      });
    }
  });
}

Unsubscribed.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
  $resource = this.$resource;

  this.pod.getClient(sysImports, channel.config.domain)
    .unsubscribes()
    .list(imports, function (err, addrs) {
      var a;
      if (err) {
        next(err);
      } else {
        for (var i = 0; i < addrs.items[i].length; i++) {
          next(err, addrs.items[i]);
        }
      }
    });
}

// -----------------------------------------------------------------------------
module.exports = Unsubscribed;
