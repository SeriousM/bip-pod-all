/**
 *
 * The Bipio Giphy Pod.  on_gif action definition
 * ----------------------------------------------------------------------
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
 *
 */

function OnGif() {
}

OnGif.prototype = {};

OnGif.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource;

  this.invoke(imports, channel, sysImports, contentParts, function(err, gif) {
    if (err) {
      next(err);
    } else {
      $resource.dupFilter(gif, 'id', channel, sysImports, function(err, gif) {
        next(err, gif);
      });
    }
  });
}


OnGif.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  this.$resource._httpGet(
    'http://api.giphy.com/v1/gifs/search?q= ' + encodeURIComponent(imports.q) + ' &api_key=' + sysImports.auth.issuer_token.key,
    function(err, resp) {
      var gif;
      if (err) {
        next(err);
      } else if (resp.data) {
        for (var i = 0; i < resp.data.length; i++) {
          gif = resp.data[i];
          // flatten original
          for (var k in gif.images.original) {
            gif['image_original_' + k] = gif.images.original[k];
          }
          next(false, gif);
        }
      }
    }
  )
}

// -----------------------------------------------------------------------------
module.exports = OnGif;
