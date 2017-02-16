/**
 *
 * AddSubscriber
 * ---------------------------------------------------------------
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

function AddSubscriber(podConfig) {
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

AddSubscriber.prototype = {};

AddSubscriber.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
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
        self.pod.callMC('lists', 'subscribe', args, sysImports, function(err, response) {
          next(err, response);
        });
      }
    })(args, sysImports, self, next)
  );
}

// -----------------------------------------------------------------------------
module.exports = AddSubscriber;