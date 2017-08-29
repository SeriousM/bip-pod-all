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

function Read_temperature(podConfig) {
}

Read_temperature.prototype = {};


Read_temperature.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  this.invoke.apply(this, arguments);
}

Read_temperature.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod;

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
            next(false, thermostat);
          }
        } else {
          next('Device Not Found');
        }
      }
    }
  );
}

// -----------------------------------------------------------------------------
module.exports = Read_temperature;
