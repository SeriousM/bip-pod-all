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
function Bounced() {}

Bounced.prototype = {};

Bounced.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
  $resource = this.$resource;

  this.pod.getClient(sysImports, channel.config.domain)
    .bounces()
    .list(imports, function (err, addrs) {
      var a;
      if (err) {
        next(err);
      } else {
        for (var i = 0; i < addrs.items[i].length; i++) {
            a = addrs.items[i];
            a['addr_code'] = a['address'] + '_' + a['code'];
            $resource.dupFilter(a, 'addr_code', channel, sysImports, function(err, addr) {
                  next(err, addr);
            });
        }
      }
    });
}

// -----------------------------------------------------------------------------
module.exports = Bounced;
