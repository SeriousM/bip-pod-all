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

function ScrapeURL(podConfig) {
  this.name = 'scrape_nlp_url';
  this.description = 'Scrape a URL using natural language',
  this.description_long = 'Extract structured data from a URL using natural language.',
  this.trigger = false;
  this.singleton = true;
  this.auto = true;
  this.podConfig = podConfig;
}

ScrapeURL.prototype = {};

// ScrapeURL schema definition
// @see http://json-schema.org/
ScrapeURL.prototype.getSchema = function() {
  return {   
    "imports": {
      "properties" : {
        "url" : {
          "type" :  "string",
          "description" : "Source URL"
        },
        "query" : {
          "type" :  "string",
          "description" : "NLP Query"
        }
      }
    },
    "exports": {
      "properties" : {
        "resultText" : {
          "type" : "string",
          "description" : "Result Text"
        },
        "resultURL" : {
          "type" : "string",
          "description" : "Result URL"
        }
      }
    }
  }
}


ScrapeURL.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  
  if (imports.url && imports.query) {
    this.pod.post(
      'url/URLGetConstraintQuery',
      {
        url : imports.url,
        cquery : imports.query
      },
      sysImports,
      function(err, body) {
        if (err) {
          next(err);
        } else {
          if (body.queryResults && body.queryResults.length) {
            for (var i = 0; i < body.queryResults.length; i++) {
              next(false, body.queryResults[i]);                
            }            
          }
        }
      }
    );
  }
}

// -----------------------------------------------------------------------------
module.exports = ScrapeURL;