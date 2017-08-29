/**
 *
 * AddSegmentStatic
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

function AddSegmentStatic(podConfig) {
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

AddSegmentStatic.prototype = {};

AddSegmentStatic.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  var self = this;
  if (method === 'get_lists') {
    res.contentType(self.pod.getActionRPC(self.name, method).contentType);
    this.pod.getList(sysImports, function(err, result) {
      if (err) {
        res.send(err, 500);
      } else {
        res.send(result);
      }
    });
  } else {
    res.send(404);
  }
}

AddSegmentStatic.prototype.setup = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

AddSegmentStatic.prototype.teardown = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

AddSegmentStatic.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var log = this.$resource.log,
  args;

  if (imports.list_id && imports.segment_name) {
    args = {
      id : imports.list_id,
      name : imports.segment_name
    };

    this.pod.callMC('lists', 'static-segment-add', args, sysImports, function(err, response) {
      next(err, response);
    });
  }
}

// -----------------------------------------------------------------------------
module.exports = AddSegmentStatic;