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

function ServerStatus() {}

ServerStatus.prototype.hostCheck = function(host, channel, next) {
  var config = this.pod.getConfig();
  this.$resource._isVisibleHost.call(this.pod, host, function(err, blacklisted) {
    next(err, blacklisted.length !== 0);
  }, channel, config.whitelist ? config.whitelist : []);
}

ServerStatus.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod;

  this.hostCheck(imports.host, channel, function(err, blacklisted) {
    if (err) {
      next(err);
    } else if (blacklisted) {
      next('Requested Host ' + imports.host + ' Is Blacklisted');
    } else {
      mc.ping(imports, function(err, response) {
        if (!err) {
          pod.stripColors(response);
          response.players_max = response.players.max;
          response.players_online = response.players.online;
          response.version_name = response.version.name;
          response.version_protocol = response.version.protocol;
        }
        next(err, response);
      });
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = ServerStatus;
