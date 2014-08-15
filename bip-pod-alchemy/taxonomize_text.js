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

function TaxonomizeText(podConfig) {
  this.name = 'taxonomize_text';
  this.description = 'Classify Text',
  this.description_long = 'Classifies Text Content',
  this.trigger = false;
  this.singleton = true;
  this.auto = true;
  this.podConfig = podConfig;
}

TaxonomizeText.prototype = {};

TaxonomizeText.prototype.getSchema = function() {
  return {   
    "imports": {
      "properties" : {
        "text" : {
          "type" :  "string",
          "description" : "Source Text"
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

TaxonomizeText.prototype.invoke = function(imports, channel, sysImports, contentParts, next) { 
  if (imports.text) {
    var params = {
      text : encodeURIComponent(imports.text)
    }
    
    this.pod.post(
      'text/TextGetRankedTaxonomy',
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
module.exports = TaxonomizeText;

