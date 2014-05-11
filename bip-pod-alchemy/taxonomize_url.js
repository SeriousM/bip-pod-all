/**
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2013 CloudSpark pty ltd http://www.cloudspark.com.au
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

function TaxonomizeURL(podConfig) {
  this.name = 'taxonomize_url';
  this.description = 'Classify by URL',
  this.description_long = 'Classifies web content by URL',
  this.trigger = false;
  this.singleton = true;
  this.auto = true;
  this.podConfig = podConfig;
}

TaxonomizeURL.prototype = {};

TaxonomizeURL.prototype.getSchema = function() {
  return {   
    "imports": {
      "properties" : {
        "url" : {
          "type" :  "string",
          "description" : "Source URL"
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

TaxonomizeURL.prototype.invoke = function(imports, channel, sysImports, contentParts, next) { 
  if (imports.url) {
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
}

// -----------------------------------------------------------------------------
module.exports = TaxonomizeURL;