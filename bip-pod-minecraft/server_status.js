/**
 *
 * The Bipio Minecraft Pod.  server_status action definition
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

var mc = require('minecraft-protocol');

function Server_status(podConfig) {
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Server_status.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  mc.ping(imports, function(err, response) {

    if (!err) {
      response.players_max = response.players.max;
      response.players_online = response.players.online;
      response.version_name = response.version.name;
      response.version_protocol = response.version.protocol;
    }

    next(err, response);
  });
}

// -----------------------------------------------------------------------------
module.exports = Server_status;
