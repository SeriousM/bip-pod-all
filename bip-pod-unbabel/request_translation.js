/**
 *
 * The Bipio Unbabel Pod
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

function RequestTranslation() {
}

RequestTranslation.prototype = {};

// RPC/Renderer accessor - /rpc/render/channel/{channel id}/hello
RequestTranslation.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  var self = this;
  if (method === 'update_status') {
    res.contentType(self.pod.getActionRPC(self.name, method).contentType);
    res.send('world');
  } else {
    res.send(404);
  }
}

RequestTranslation.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var modelName = this.$resource.getDataSourceName('track_translation'),
    pod = this.pod,
    payload = imports;
    payload.target_language = imports.target_language;

  pod.requestPOST('translation', payload, sysImports, function(err, response) {
    if (!err) {
      response.price_eur = response.price;
    }
    next(err, response);
  });

}

// -----------------------------------------------------------------------------
module.exports = RequestTranslation;