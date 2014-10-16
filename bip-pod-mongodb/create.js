/**
 *
 * The Bipio MongoDB Pod.  mongodb Create definition
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

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


function Create(podConfig) {
  this.name = 'create'; 
  this.title = 'create', 
  this.description = 'Create a MongoDB document',
  this.trigger = false; 
  this.singleton = false; 
  this.auto = false; 
  this.podConfig = podConfig; 
}

Create.prototype = {};

Create.prototype.getSchema = function() {
  return {
    "imports": {
      "properties" : {
        "document_json" : {
          "type" :  "object",
          "description" : "Document (JSON) to Insert"
        },
        "collection" : {
          "type" : "string",
          "description" : "Name of the Collection"
        }
      }
    },
    "exports": {
      "properties" : {
        "status" : {
          "type" : "string",
          "description" : "Status: Error or ok"
        }
      }
    }
  }
}

// RPC/Renderer accessor - /rpc/render/channel/{channel id}/insert
Create.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  if (method === 'insert') {
    res.contentType(this.getSchema().renderers[method].contentType);
    res.send('document inserted');
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
Create.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    

    if (imports.document_json && imports.collection) {
    
        var url = sysImports.auth.issuer_token.username;
        console.log(url);
        
        MongoClient.connect(url, { auto_reconnect: true }, function(err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to server");
            var collection = db.collection(imports.collection);
            collection.insert(imports.document_json, function(err, result) {
                assert.equal(err, null);
                console.log("Inserted " + result + " into collection");

            });
            db.close();
        });
    }


}
// -----------------------------------------------------------------------------
module.exports = Create;
