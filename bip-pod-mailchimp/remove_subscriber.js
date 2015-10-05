/**
 *
 * AddSubscriber
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
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

function RemoveSubscriber(podConfig) {
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

RemoveSubscriber.prototype = {};

RemoveSubscriber.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var log = this.$resource.log,
    self = this,
    args = {
      id : imports.list_id,
      email : {
        email : imports.email
      }
    };

  this.pod.limitRate(
    channel,
    (function(args, sysImports, self, next) {
      return function() {
        self.pod.callMC('lists', 'unsubscribe', args, sysImports, function(err, response) {
          next(err, response);
        });
      }
    })(args, sysImports, self, next)
  );
}

// -----------------------------------------------------------------------------
module.exports = RemoveSubscriber;