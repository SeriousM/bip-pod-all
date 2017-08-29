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

function ResolveMX() {}

ResolveMX.prototype = {};

ResolveMX.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var tldTools = this.pod.tldTools();
  var tokens = tldTools.extract(imports.url),
  domain = tokens.inspect.getDomain();

  if (!domain) {
    next('Could not extract domain for ' + imports.url);
  } else {
    this.pod.get().resolveMx(domain, function(err, records) {
      if (err) {
        next(err);
      } else {
        var exports = {
          mx : [],
          mx_first : null
        },
        mx;

        var p;
        for (var i = 0; i < records.length; i++) {
          mx = records[i];
          exports.mx.push(mx);

          if (undefined === p || p <= mx.priority) {
            exports.mx_first = mx;
            p = mx.priority;
          }
        }
        next(false, exports);
      }
    });
  }
}

// -----------------------------------------------------------------------------
module.exports = ResolveMX;