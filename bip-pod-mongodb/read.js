/**
 *
 * The Bipio MongoDB Pod.  mongodb Read definition
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

function Read(podConfig) {
  this.name = 'read'; 
  this.title = 'read', 
  this.description = 'Read a MongoDB document',
  this.trigger = false; 
  this.singleton = false; 
  this.auto = false; 
  this.podConfig = podConfig; 
}

Read.prototype = {};

// Read schema definition
// @see http://json-schema.org/
Read.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "instring_override" : {
          "type" :  "string",
          "description" : "String goes in"
        }
      }
    },
    "imports": {
      "properties" : {
        "instring" : {
          "type" :  "string",
          "description" : "String goes in"
        }
      }
    },
    "exports": {
      "properties" : {
        "outstring" : {
          "type" : "string",
          "description" : "String goes out"
        }
      }
    },
    'renderers' : {
      'hello' : {
        description : 'Hello World',
        description_long : 'Hello World',
        contentType : DEFS.CONTENTTYPE_XML
      }     
    }
  }
}

// RPC/Renderer accessor - /rpc/render/channel/{channel id}/hello
Read.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  if (method === 'hello') {
    res.contentType(this.getSchema().renderers[method].contentType);
    res.send('world');
  } else {
    res.send(404);
  }
}

// channel presave setup
// setup data sources
Read.prototype.setup = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

// channel destroy/teardown
// you can remove any stored data here
Read.prototype.teardown = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
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
Read.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  next(
    false,
    {
      "outstring" : channel.config.instring_override || imports.instring
    }
    );
}

// -----------------------------------------------------------------------------
module.exports = Read;
