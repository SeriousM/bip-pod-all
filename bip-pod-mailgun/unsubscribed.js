/**
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
 *
 */

function Unsubscribed() {}

Unsubscribed.prototype = {};

Unsubscribed.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource;
  this.invoke(imports, channel, sysImports, contentParts, function(err, exports) {
    if (err) {
      next(err);
    } else {
      $resource.dupFilter(exports, 'address', channel, sysImports, function(err, addr) {
        next(err, addr);
      });
    }
  });
}

Unsubscribed.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
  $resource = this.$resource;

  this.pod.getClient(sysImports, imports.domain)
    .unsubscribes()
    .list(imports, function (err, addrs) {
      var a;
      if (err) {
        next(err);
      } else {
        for (var i = 0; i < addrs.items[i].length; i++) {
          next(err, addrs.items[i]);
        }
      }
    });
}

// -----------------------------------------------------------------------------
module.exports = Unsubscribed;
