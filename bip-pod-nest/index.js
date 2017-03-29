/**
 *
 * nest Actions
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
 */
var Pod = require('bip-pod'),
    Nest = new Pod(),
    baseURL = 'https://developer-api.nest.com',
    agentHeader = {
      'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1309.0 Safari/537.17',
    };

Nest.readAll  = function(accessToken, next) {
  this._httpGet(
      baseURL + '/?auth=' + accessToken,
      next,
      agentHeader
    );
}

Nest.writeDevice = function(deviceId, settings, accessToken, next) {
  this._httpPut(
      baseURL + '/devices/' + deviceId + '?auth=' + accessToken,
      settings,
      next,
      agentHeader
    );
}

Nest.rpc = function(action, method, sysImports, options, channel, req, res) {
  var self = this,
    _ = this.$resource._;

  if (method == 'device_ids') {
    this.readAll(
      sysImports.auth.oauth.access_token,
      function(err, resp) {
        if (err) {
          res.status(500).send(err);
        } else {
          var structs = resp.structures;

          _.each(resp.devices.thermostats, function(device, deviceId) {
              if (structs[device.structure_id]) {
                device.name = '(' + structs[device.structure_id].name + ') ' + device.name;
                device.name_long = '(' + structs[device.structure_id].name + ') ' + device.name_long;
              }
          });

          res.send(resp.devices);
        }
      }
    );

  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

// -----------------------------------------------------------------------------
module.exports = Nest;
