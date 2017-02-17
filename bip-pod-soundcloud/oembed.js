/**
 *
 * The Bipio Soundcloud Pod
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
var request = require('request');
function OEmbed(podConfig) {}

OEmbed.prototype = {};

/**
 * Invokes (runs) the action.
 */
OEmbed.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var uri = '/oembed?format=json',
  log = this.$resource.log;

  request.get(
    this.pod._apiURL + uri + '&url=' + imports.url,
    function(error, res, res) {
      if (error) {
        log(res, channel, 'error');
      }
      next(error, JSON.parse(res));
    });

}

// -----------------------------------------------------------------------------
module.exports = OEmbed;