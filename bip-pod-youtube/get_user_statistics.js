/**
 *
 * The Bipio Youtube Pod.  get_statistics action definition
 * ----------------------------------------------------------------------
 *
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
 *
 */

function Get_statistics(podConfig) {
}

Get_statistics.prototype = {};

Get_statistics.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.pod.$resource,
    url = 'http://gdata.youtube.com/feeds/api/users/' + imports.username + '?alt=json';

  $resource._httpGet(url, function(err, body) {
    next(err, body.entry['yt$statistics'] );
  });
}

// -----------------------------------------------------------------------------
module.exports = Get_statistics;