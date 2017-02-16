/**
 *
 * The Bipio Minecraft Pod.  server_status action definition
 * ----------------------------------------------------------------------
 *
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
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
