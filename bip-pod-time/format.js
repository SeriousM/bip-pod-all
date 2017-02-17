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

function Format() {}

Format.prototype = {};

Format.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var time = this.pod.get(imports.time);
  if (time.isValid()) {
    var exports = {}
    if (imports.format) {
      exports.time_formatted = time.format(imports.format)
    } else {
      exports.time_formatted = time.toString();
    }

    next(false, exports);

  } else {
    next('Invalid Date at ' + time.invalidAt());
  }
}

// -----------------------------------------------------------------------------
module.exports = Format;