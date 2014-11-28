/**
 *
 * The Bipio MongoDB Pod.  mongodb Update definition
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

function Update() {}

Update.prototype = {};


/**
 * Action Invoker - the primary function of a channel
 *
 */
Update.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var document, match;

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

  if (app.helper.isObject(imports.match)) {
    match = imports.match;
  } else {
    try {
      match = JSON.parse(imports.match);
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
          collection.update(match, { $set : document } , function(err, result) {
              next(err, {});
          });
        }
      });
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = Update;
