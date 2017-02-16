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

function OnNewAlert() {}

OnNewAlert.prototype = {};

OnNewAlert.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource;

  this.invoke(imports, channel, sysImports, contentParts, function(err, exports) {
    if (err) {
      next(err);
    } else {
      $resource.dupFilter(exports, '_cid', channel, sysImports, function(err, alert) {
        if (err) {
          next(err);
        } else {
          next(false, alert);
        }
      });
    }
  });
}

OnNewAlert.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource;

  this.pod.apiGetRequest('/alert', sysImports, function(err, res, headers, statusCode) {
    if (err || 200 !== statusCode) {
      next(err || res.message);
    } else if ($resource.helper.isArray(res)) {
      for (var i = 0; i < res.length; i++) {
        next(false, res[i]);
      }
    } else {
      next('Malformed Response ' + res);
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = OnNewAlert;
