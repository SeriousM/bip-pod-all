/**
 *
 * AddItem
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

function AddItem() {}

AddItem.prototype = {};

// RPC/Renderer accessor - /rpc/render/channel/{channel id}/hello
AddItem.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  if (method === 'get_projects') {
    this.pod.getRequest('getProjects', sysImports, {}, function(err, result, headers, statusCode) {
      res.contentType(headers['content-type']);
      if (err) {
        res.send(500);
      } else if (statusCode !== 200) {
        res.send(statusCode, result);
      } else {
        res.send(result);
      }
    });
  } else {
    res.send(404);
  }
}

AddItem.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var log = this.$resource.log,
    args;

  var params = {
    project_id : imports.project_id,
    content : imports.content
  };

  if (imports.due_date) {
    params.due_date = imports.due_date;
  }

  if (imports.date_string) {
    params.date_string = imports.date_string;
  }

  this.pod.getRequest('addItem', sysImports, params, function(err, result, headers, statusCode) {
    if (!err && statusCode !== 200) {
      err = result;
    }
    next(err, result);
  });

}

// -----------------------------------------------------------------------------
module.exports = AddItem;