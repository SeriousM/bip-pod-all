/**
 *
 * AddItem
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2013 Michael Pearson https://github.com/mjpearson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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