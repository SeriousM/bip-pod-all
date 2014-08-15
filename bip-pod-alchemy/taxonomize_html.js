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

function TaxonomizeHTML(podConfig) {
  this.name = 'taxonomize_html';
  this.description = 'Classify by HTML',
  this.description_long = 'Classifies HTML Content',
  this.trigger = false;
  this.singleton = true;
  this.auto = true;
  this.podConfig = podConfig;
}

TaxonomizeHTML.prototype = {};

TaxonomizeHTML.prototype.getSchema = function() {
  return {   
    "imports": {
      "properties" : {
        "html" : {
          "type" :  "string",
          "description" : "Source HTML"
        },
        "url" : {
          "type" :  "string",
          "description" : "Source URL of HTML"
        },
        "query" : {
          "type" :  "string",
          "description" : "NLP Query (optional)"
        }
      }
    },
    "exports": {
      "properties" : {
        "language" : {
          "type" : "string",
          "description" : "Detected Language"
        },
        "label_highest" : {
          "type" : "string",
          "description" : "Category Label"
        },
        "label_highest_score" : {
          "type" : "string",
          "description" : "Highest Category Score"
        },
        "taxonomy" : {
          "type" : "array",
          "description" : "List of all taxonomies"
        }
      }
    }
  }
}

TaxonomizeHTML.prototype.invoke = function(imports, channel, sysImports, contentParts, next) { 
  if (imports.html && imports.url) {
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
}

// -----------------------------------------------------------------------------
module.exports = TaxonomizeHTML;