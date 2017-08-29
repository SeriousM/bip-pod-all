/**
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

// @see https://developer.nest.com/documentation/api-reference

function Set_temperature(podConfig) {
}

Set_temperature.prototype = {};

Set_temperature.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

  var settings = {},
    self = this,
    pod = this.pod,
    targetScale = 'target_temperature_' + imports.temperature_scale.toLowerCase();

  settings[targetScale] = imports.target_temperature;

  pod.readAll(
    sysImports.auth.oauth.access_token,
    function(err, resp, headers, code) {
      var thermostat;

      if (err) {
        next(err);

      } else if (401 == code) {
        pod.removeCredential(
          channel.owner_id,
          pod.getName()
        );

        next('Not Authorized.  Please Re-Authorize Nest');

      } else {
        if (resp.devices.thermostats[imports.device_id]) {
          thermostat = resp.devices.thermostats[imports.device_id];
          if ('away' === resp.structures[thermostat.structure_id].away) {
            next(thermostat.name + ' Is In Away Mode');
          } else {
            self.pod.writeDevice(
              'thermostats/' + imports.device_id,
              settings,
              sysImports.auth.oauth.access_token,
              function(err, resp) {
                if (err) {
                  next(err);
                } else {
                  next(false, {});
                }
              }
            );
          }
        } else {
          next('Device Not Found');
        }
      }
    }
  );
}

// -----------------------------------------------------------------------------
module.exports = Set_temperature;
