/**
 *
 * The Bipio MongoDB Pod.  mongodb Insert definition
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

var MongoClient = require('mongodb').MongoClient;

function Insert(podConfig) {
  this.name = 'insert';
  this.title = 'Insert a document into MongoDB',
  this.description = 'Insert a MongoDB document',
  this.trigger = false;
  this.singleton = false;
  this.auto = false;
  this.podConfig = podConfig;
}

Insert.prototype = {};

Insert.prototype.getSchema = function() {
  return {
    'imports': {
      'properties' : {
         'collection' : {
          'type' : 'string',
          'description' : 'Name of the Collection'
        },
        'document' : {
          'type' :  'mixed',
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
Insert.prototype.rpc = function(method, sysImports, options, channel, req, res) {
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
Insert.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

    if (imports.document && imports.collection) {

        var url = sysImports.auth.issuer_token.username,
          document;

        if (app.helper.isObject(imports.document)) {
          document = imports.document;
        } else {
          try {
            document = JSON.parse(imports.document);
          } catch (e) {
            next(e);
            return;
          }
        }

        MongoClient.connect(url, { auto_reconnect: true }, function(err, db) {
//        this.pod.getClient(url, "insert", function(err, db) {
            if (err) { console.log(err); }
            db.collection(imports.collection, function(err, collection) {
                collection.insert(document, function(err, result) {
                    if (err) { 
                        return err; 
                    }
                    console.log('Inserted ' + result.result + ' into collection');
                });
            });
        });

    }
}
// -----------------------------------------------------------------------------
module.exports = Insert;
