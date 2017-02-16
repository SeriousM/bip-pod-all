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

function GetGTLD() {}

GetGTLD.prototype = {};

GetGTLD.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var tldTools = this.pod.tldTools();
  var tokens = tldTools.extract(imports.url);
  var exports = {
    gtld : tokens.tld ? tokens.tld : tokens.domain,
    domain : tokens.domain,
    subdomain : tokens.subdomain,
    protocol : tokens.url_tokens.protocol.replace(':', ''),
    host : tokens.url_tokens.hostname
  };

  next(false, exports);
}

// -----------------------------------------------------------------------------
module.exports = GetGTLD;