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
      },
      "required" : [ "document", "collection" ]
    }
  }
}

/**
 * Action Invoker - the primary function of a channel
 *
 */
Insert.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

  if (imports.document && imports.collection) {

    var document;

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

    this.pod.getClient(sysImports, function(err, db) {
      if (err) { next(err); } else {
        db.collection(imports.collection, function(err, collection) {
            if (err) { next(err); } else {
                collection.insert(document, function(err, result) {
                    if (err) { next(err); } else {
                        next(err, {});
                    }
                });   
            }
        });
      }
    });
  }
}
// -----------------------------------------------------------------------------
module.exports = Insert;
