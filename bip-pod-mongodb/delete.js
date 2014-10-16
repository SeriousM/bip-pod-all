/**
 *
 * The Bipio MongoDB Pod.  mongodb Delete definition
 * ---------------------------------------------------------------
 *
 * @author Scott Tuddenham <scott@bip.io>
 * Copyright (c) 2014 WoT.IO http://wot.io
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

function Delete(podConfig) {
  this.name = 'delete'; 
  this.title = 'delete', 
  this.description = 'Delete a MongoDB document',
  this.trigger = false; 
  this.singleton = false; 
  this.auto = false; 
  this.podConfig = podConfig; 
}

Delete.prototype = {};

// Delete schema definition
// @see http://json-schema.org/
Delete.prototype.getSchema = function() {
  return {
   "imports": {
      "properties" : {
        "query_json" : {
          "type" :  "object",
          "description" : "The json object (document) to remove"
        }
      }
    },
    "exports": {
      "properties" : {
        "status" : {
          "type" : "string",
          "description" : "Error or OK for successful removal"
        }
      }
    }
  }
}

// RPC/Renderer accessor - /rpc/render/channel/{channel id}/hello
Delete.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  if (method === 'hello') {
    res.contentType(this.getSchema().renderers[method].contentType);
    res.send('world');
  } else {
    res.send(404);
  }
}


/**
 * Action Invoker - the primary function of a channel
 * 
 * @param Object imports transformed key/value input pairs
 * @param Channel channel invoking channel model
 * @param Object sysImports
 * @param Array contentParts array of File Objects, key/value objects
 * with attributes txId (transaction ID), size (bytes size), localpath (local tmp file path)
 * name (file name), type (content-type), encoding ('binary') 
 * 
 * @param Function next callback(error, exports, contentParts, transferredBytes)
 * 
 */
Delete.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  next(
    false,
    {
      "outstring" : channel.config.instring_override || imports.instring
    }
    );
}

// -----------------------------------------------------------------------------
module.exports = Delete;
