/**
 *
 * The Bipio MongoDB Pod.  mongodb Find definition
 * ---------------------------------------------------------------
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var MongoClient = require('mongodb').MongoClient;

function Find() {}

Find.prototype = {};

Find.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var query;

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

  this.pod.getClient(sysImports, function(err, db) {
    if (err) {
      next(err);
    } else {
      db.collection(imports.collection, function(err, collection) {
        if (err) {
          next(err);
        } else {
          collection.find(query).toArray( function(err, results) {
            if (err) {
              next(err);
            } else {
              for (var i = 0; i < results.length; i++) {
                next(false, results[i]);
              }
            }
          });
        }
      });
    }
  });

}

// -----------------------------------------------------------------------------
module.exports = Find;
