/**
 *
 * The Bipio Embedly Pod
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

function OEmbed() {}

OEmbed.prototype = {};

/**
 * Invokes (runs) the action.
 */
OEmbed.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var log = this.$resource.log,
    pod = this.pod;

  pod.api(channel, sysImports, function(err, api) {
    if (err) {
      next(err);
    } else {
      var opts = {
        url : imports.url ,
        format : 'json'
      };

      pod._testAndSet(imports, opts, 'maxwidth');
      pod._testAndSet(imports, opts, 'maxheight');
      pod._testAndSet(imports, opts, 'autoplay');
      pod._testAndSet(imports, opts, 'words');

      api.oembed(opts, function(err, obj) {
        if (err) {
          log(err, channel, 'error');
        } else {
          for (var i = 0; i < obj.length; i++) {
            next(false, obj[i], contentParts, 0);
          }
        }
      }
      );
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = OEmbed;