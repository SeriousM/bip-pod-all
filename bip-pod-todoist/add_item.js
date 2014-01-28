/**
 *
 * AddItem
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2013 CloudSpark pty ltd http://www.cloudspark.com.au
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

function AddItem(podConfig) {
  this.name = 'add_item'; // action name (channel action suffix - "action: boilerplate.simple")
  this.description = 'Add a Task', // short description
  this.description_long = 'Adds a Todoist Task', // long description
  this.trigger = false; // this action can trigger
  this.singleton = true; // 1 instance per account (can auto install)
  this.auto = false; // automatically install this action
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

AddItem.prototype = {};

// AddItem schema definition
// @see http://json-schema.org/
AddItem.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "project_id" : {
          "type" :  "string",
          "description" : "Project ID"
        }
      }
    },
    "imports": {
      "properties" : {
        "due_date" : {
          "type" :  "string",
          "description" : "Due Date (literal)"
        },
        "date_string" : {
          "type" :  "string",
          "description" : "Due Date (natural language)"
        },
        "content" : {
          "type" :  "string",
          "description" : "Task Content"
        }
      }
    },
    "exports": {
      "properties" : {
        "id" : {
          "type" :  "string",
          "description" : "Task ID"
        },
        "due_date" : {
          "type" :  "string",
          "description" : "Due Date (literal)"
        },
        "date_string" : {
          "type" :  "string",
          "description" : "Due Date (natural language)"
        },
        "content" : {
          "type" :  "string",
          "description" : "Task Content"
        }
      }
    },
    'renderers' : {
      'get_projects' : {
        description : 'Retrieve Projects',
        description_long : 'Retrieves all projects for your account',
        contentType : DEFS.CONTENTTYPE_JSON
      }
    }
  }
}

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

  if (channel.config.project_id && imports.content) {
    var params = {
      project_id : channel.config.project_id,
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
}

// -----------------------------------------------------------------------------
module.exports = AddItem;