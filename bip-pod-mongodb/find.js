/**
 *
 * The Bipio MongoDB Pod.  mongodb Find definition
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

function Find(podConfig) {
  this.name = 'find'; 
  this.title = 'Find a MongoDB Collection of Documents', 
  this.description = 'Find a MongoDB Collection of Documents',
  this.trigger = false; 
  this.singleton = false; 
  this.auto = false; 
  this.podConfig = podConfig; 
}

Find.prototype = {};

Find.prototype.getSchema = function() {
  return {
    'imports': {
      'properties' : {
         'collection' : {
          'type' : 'string',
          'description' : 'Name of the Collection'
        },
        'query' : {
            'type' : 'object',
            'description' : 'Query to Search On'
        }
      }
    },

    'exports': {
      'properties' : {
        'found_documents' : {
          'type' : 'object',
          'description' : 'Array of Document(s)'
        }
      }
    }
  }
}

/**
 * Action Invoker - the primary function of a channel
 * 
 */
Find.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    
    if (imports.query && imports.collection) {
   
        var url = sysImports.auth.issuer_token.username,
            query;

            if (app.helper.isObject(imports.query)) {
            query = imports.query;
            } else {
            try {
                query = JSON.parse(imports.query);
            } catch (e) {
                next(e);
                return;
            }
            }


        MongoClient.connect(url, { auto_reconnect: true }, function(err, db) {
            console.log('Connected correctly to server');
            db.collection(imports.collection, function(err, collection) {
                collection.find(query).toArray( function(err, results) {
                    if (err) {
                        return err;
                    }
                    console.log(results);
                    return results;
                });
            });
        });
    }
}

// -----------------------------------------------------------------------------
module.exports = Find;
