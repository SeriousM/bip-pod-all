/**
 *
 * The Bipio HipChat Pod
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

function CreateWebHook() {}

CreateWebHook.prototype = {};

CreateWebHook.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var client = this.pod.getClient(sysImports);
  client.create_webhook(
    imports.room_id,
    imports,
    function(err, result) {
      var exports = {};
      if (err) {
        err = result;
      } else {
        exports.hook_id = result.id;
        exports.link_self = result.links.self;
      }

      next(err, exports);
    }
    );

}

// -----------------------------------------------------------------------------
module.exports = CreateWebHook;
