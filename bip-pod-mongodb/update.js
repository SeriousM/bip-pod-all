/**
 *
 * The Bipio MongoDB Pod.  mongodb Update definition
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

function Update() {}

Update.prototype = {};

/**
 * Action Invoker - the primary function of a channel
 *
 */
Update.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  try {
    var match = this.$resource.helper.getObject(imports.match),
      doc = this.$resource.helper.getObject(imports.document);

  } catch (e) {
    next(e);
    return;
  }

  this.pod.getClient(sysImports, function(err, db) {
    if (err) {
        next(err);
    } else {
      db.collection(imports.collection, function(err, collection) {
        if (err) {
          next(err);
        } else {
          collection.update(match, { $set : doc } , function(err, result) {
              next(err, {});
          });
        }
      });
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = Update;
