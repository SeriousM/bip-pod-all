/**
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

function TriggerEvent() {}

TriggerEvent.prototype = {};

TriggerEvent.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var client = this.pod.getClient(sysImports);

  try {
    client.trigger(
      imports.channels.split(','),
      imports.name,
      'string' === typeof imports.data ? (JSON.parse(imports.data) ) : imports.data,
      null,
      function(err, req, res) {
        if (res.statusCode !== 200) {
          next(res.body);
        } else {
          next(false, {});
        }
      }
    );
  } catch (e) {
    next(e.message);
  }

}

// -----------------------------------------------------------------------------
module.exports = TriggerEvent;