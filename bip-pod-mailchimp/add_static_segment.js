/**
 *
 * AddSegmentStatic
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
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

function AddSegmentStatic(podConfig) {
  this.name = 'add_static_segment'; // action name (channel action suffix - "action: boilerplate.simple")
  this.description = 'Add Static Segment', // short description
  this.description_long = 'Adds a Static Segment to an existing List', // long description
  this.trigger = false; // this action can trigger
  this.singleton = false; // 1 instance per account (can auto install)
  this.auto = false; // automatically install this action
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

AddSegmentStatic.prototype = {};

// AddSegmentStatic schema definition
// @see http://json-schema.org/
AddSegmentStatic.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "list_id" : {
          "type" :  "string",
          "description" : "List ID",
          oneOf : [
            {
              '$ref' : '/renderers/get_lists#data/{id}'
            }            
          ],
          label : {
            '$ref' : '/renderers/get_lists#data/{name}'
          }
        }       
      }
    },
    "imports": {
      "properties" : {
        "segment_name" : {
          "type" :  "string",
          "description" : "Segment Name"
        }
      }
    },
    "exports": {
      "properties" : {
        "id" : {
          "type" : "string",
          "description" : "Segment ID"
        }        
      }
    },
    'renderers' : {
      'get_lists' : {
        description : 'Retrieve Lists',
        description_long : 'Retrieves all lists for your account',
        contentType : DEFS.CONTENTTYPE_JSON
      }
    }
  }
}

AddSegmentStatic.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  if (method === 'get_lists') {
    res.contentType(this.getSchema().renderers[method].contentType);
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

  if (channel.config.list_id && imports.segment_name) {
    args = {
      id : channel.config.list_id,
      name : imports.segment_name
    };
    
    this.pod.callMC('lists', 'static-segment-add', args, sysImports, function(err, response) {
      next(err, response);
    });
  }
}

// -----------------------------------------------------------------------------
module.exports = AddSegmentStatic;