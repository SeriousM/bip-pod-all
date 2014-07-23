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

function ImageTagURL(podConfig) {
  this.name = 'image_tag_url';
  this.description = 'Tag an image by URL',
  this.description_long = 'Tags an image by URL',
  this.trigger = false;
  this.singleton = true;
  this.auto = true;
  this.podConfig = podConfig;
}

ImageTagURL.prototype = {};

// ImageTagURL schema definition
// @see http://json-schema.org/
ImageTagURL.prototype.getSchema = function() {
  return {   
    "imports": {
      "properties" : {
        "url" : {
          "type" :  "string",
          "description" : "Source URL"
        }
      }
    },
    "exports": {
      "properties" : {
        "tag_highest_text" : {
          "type" : "string",
          "description" : "Highest Ranked Tag Text"
        },
        "tag_highest_score" : {
          "type" : "string",
          "description" : "Highest Ranked Tag"
        },
        "tags" : {
          "type" : "array",
          "description" : "List of all tags"
        },
        // until we can transform arrays + nested objects, flatten the matched tags
        "tags_csv" : {
          "type" : "string",
          "description" : "Comma Separated List of all tags"
        }
      }
    }
  }
}

ImageTagURL.prototype.invoke = function(imports, channel, sysImports, contentParts, next) { 
  if (imports.url) {
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
}


// -----------------------------------------------------------------------------
module.exports = ImageTagURL;