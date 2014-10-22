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
  this.title = 'Create', 
  this.description = 'Create a MongoDB document',
  this.trigger = false; 
  this.singleton = false; 
  this.auto = false; 
  this.podConfig = podConfig; 
}

Create.prototype = {};

Create.prototype.getSchema = function() {
  return {
    'imports': {
      'properties' : {
         'collection' : {
          'type' : 'string',
          'description' : 'Name of the Collection'
        },
        'document_json' : {
          'type' :  'object',
          'description' : 'Document to Insert'
        }
      }
    },
    'exports': {
      'properties' : {
        'status' : {
          'type' : 'string',
          'description' : 'Status: Error or ok'
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
 */
Create.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    

    if (imports.document_json && imports.collection) {
    
        var url = sysImports.auth.issuer_token.username;
        console.log(url);
        console.log(imports.document_json);
 /*       
        MongoClient.connect(url, function(err, db) {
            if (err) { return console.dir(err); }

        var collection = db.collection(imports.collection);
        var doc1 = {'hello':'Iamdoc1'};
        var doc2 = JSON.stringify(imports.document_json);
        var doc3 = { hey: 'Iamdoc3' };
        var doc4 = imports.document_json.valueOf();
        var doc5 = JSON.parse(doc4);
        console.log(doc1, typeof doc1);
        console.log(doc2, typeof doc2);
        console.log(doc3, typeof doc3);
        console.log(doc4, typeof doc4);
        console.log(typeof imports.document_json);
        console.log(doc5, typeof doc5);
        collection.insert(doc5, function(err, result) {});

        });
*/        
        
        MongoClient.connect(url, { auto_reconnect: true }, function(err, db) {
            assert.equal(null, err);
            console.log('Connected correctly to server');
            db.collection(imports.collection, function(err, collection) {
                console.log(collection);
                collection.insert(imports.document_json, function(err, result) {
                    assert.equal(err, null);
                    console.log('Inserted ' + result + ' into collection');
                });
            });
        });
    }
}
// -----------------------------------------------------------------------------
module.exports = Create;
