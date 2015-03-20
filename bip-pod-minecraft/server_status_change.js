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

function ServerStatusChange() {}

ServerStatusChange.prototype.hostCheck = function(host, channel, next) {
  var config = this.pod.getConfig();
  this.$resource._isVisibleHost.call(this.pod, host, function(err, blacklisted) {
    next(err, blacklisted.length !== 0);
  }, channel, config.whitelist ? config.whitelist : []);
}

ServerStatusChange.prototype.deltaGate = function(imports, channel, status, next) {
  var key = imports.server + ':' + imports.port,
    $resource = this.$resource,
    self = this,
    dao = $resource.dao,
    modelName = this.$resource.getDataSourceName('delta_gate'),
    filter = {
      owner_id : channel.owner_id,
      channel_id : channel.id,
      key : key
    },
    props = {
      last_update : $resource.helper.nowUTCMS(),
      owner_id : channel.owner_id,
      channel_id : channel.id,
      key : key,
      value : status
    };

  dao.find(modelName, filter, function(err, result) {
    if (err) {
      next(err);
    } else {

      if (!result || (result && result.value !== status )) {
        next(false, true);
      }

      dao.upsert(modelName, filter, props, function(err, result) {
        if (err) {
          next(err);
        }
      });
    }
  });
}

ServerStatusChange.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var self = this;
  this.invoke(imports, channel, sysImports, contentParts, function(err, resp) {
    if (err) {
      next(err);
    } else {
      self.deltaGate(imports, channel, resp.status, function(err, delta) {
        if (err) {
          next(err);
        } else if (delta) {
          next(false, resp);
        }
      });
    }
  });
}

ServerStatusChange.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  this.hostCheck(imports.host, channel, function(err, blacklisted) {
    if (err) {
      next(err);
    } else if (blacklisted) {
      next('Requested Host ' + imports.host + ' Is Blacklisted');
    } else {
      mc.ping(imports, function(err, response) {
        if (!err) {
          response.players_max = response.players.max;
          response.players_online = response.players.online;
          response.version_name = response.version.name;
          response.version_protocol = response.version.protocol;
          response.status = 'up';
        } else {
          response = {};
          response.status = 'down';
        }

        next(false, response);
      });
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = ServerStatusChange;
