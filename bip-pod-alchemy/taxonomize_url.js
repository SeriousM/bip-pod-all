/**
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2013 Michael Pearson https://github.com/mjpearson
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

function TaxonomizeURL() {}

TaxonomizeURL.prototype = {};

TaxonomizeURL.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var params = {
    url : imports.url
  }
  if (imports.query) {
    params.sourceText = 'cquery';
    params.cquery = imports.query;
  }

  this.pod.post(
    'url/URLGetRankedTaxonomy',
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
module.exports = TaxonomizeURL;
