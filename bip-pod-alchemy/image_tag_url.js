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

function ImageTagURL() {}

ImageTagURL.prototype = {};

ImageTagURL.prototype.invoke = function(imports, channel, sysImports, files, next) {
  var params = {
    url : imports.url
  }

  this.pod.post(
    'url/URLGetRankedImageKeywords',
    params,
    sysImports,
    function(err, body) {
      var exports;
      if (err) {
        next(err);
      } else {
        exports = {
          tags : body.imageKeywords,
          tag_highest_text : body.imageKeywords[0].text,
          tag_highest_score : body.imageKeywords[0].score,
          tags_csv : ''
        };

        for (var i = 0; i < body.imageKeywords.length; i++) {
          if (exports.tags_csv) {
            exports.tags_csv += ',';
          }
          exports.tags_csv += body.imageKeywords[i].text;
        }

        next(false, exports);
      }
    }
  );
}

// -----------------------------------------------------------------------------
module.exports = ImageTagURL;
