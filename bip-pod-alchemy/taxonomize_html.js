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

function TaxonomizeHTML() {}

TaxonomizeHTML.prototype = {};

TaxonomizeHTML.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var params = {
    html : encodeURIComponent(imports.html),
    url : encodeURIComponent(imports.url)
  }

  if (imports.query) {
    params.sourceText = 'cquery';
    params.cquery = imports.query;
  }

  this.pod.post(
    'html/HTMLGetRankedTaxonomy',
    params,
    sysImports,
    function(err, body) {
      if (err) {
        next(err);
      } else {
        next(
          false,
          {
            language : body.language,
            taxonomy : body.taxonomy,
            label_highest : body.taxonomy[0].label,
            label_highest_score : body.taxonomy[0].score
          }
        );
      }
    }
  );
}

// -----------------------------------------------------------------------------
module.exports = TaxonomizeHTML;
