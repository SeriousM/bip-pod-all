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

function ScrapeHTML(podConfig) {
  this.name = 'scrape_nlp_html';
  this.title = 'Scrape HTML using natural language',
  this.description = 'Extract structured data for uploaded HTML using natural language',
  this.trigger = false;
  this.singleton = true;
  this.auto = true;
  this.podConfig = podConfig;
}

ScrapeHTML.prototype = {};

// ScrapeHTML schema definition
// @see http://json-schema.org/
ScrapeHTML.prototype.getSchema = function() {
  return {   
    "imports": {
      "properties" : {
        "html" : {
          "type" :  "string",
          "description" : "Source HTML"
        },
        "query" : {
          "type" :  "string",
          "description" : "NLP Query"
        }
      },
      "required" : [ "html", "query" ]
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


ScrapeHTML.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  
  if (imports.html && imports.query) {
    this.pod.post(
      'html/HTMLGetConstraintQuery',
      {
        html : imports.html,
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
module.exports = ScrapeHTML;
