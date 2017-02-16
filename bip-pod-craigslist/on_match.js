/**
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

function OnMatch() {}

OnMatch.prototype = {};

OnMatch.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource;

  this.invoke(imports, channel, sysImports, contentParts, function(err, listing) {
    if (err) {
      next(err);
    } else {
      $resource.dupFilter(listing, 'pid', channel, sysImports, function(err, listing) {
        next(err, listing);
      });
    }
  });
}

OnMatch.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var opts = {
    city : imports.city.replace(/\s*/g, '')
  }

  if (imports.min) {
    opts.minAsk = imports.min;
  }

  if (imports.max) {
    opts.maxAsk = imports.max;
  }

  this.pod.search(imports.query, opts, function(err, listings) {
    if (err) {
      next(err);
    } else {
      for (var i = 0; i < listings.length; i++) {
        next(false, listings[i]);
      }
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = OnMatch;
