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

function SentimentText(podConfig) {
  this.name = 'sentiment_text';
  this.title = 'Get Sentiment from Text',
  this.description = 'Analyses the sentiment (positive, neutral, negative, mixed) of the given text',
  this.trigger = false;
  this.singleton = true;
  this.auto = true;
  this.podConfig = podConfig;
}

SentimentText.prototype = {};

SentimentText.prototype.getSchema = function() {
  return {   
    "imports": {
      "properties" : {
        "text" : {
          "type" :  "string",
          "description" : "Source Text"
        },
        "url" : {
          "type" :  "string",
          "description" : "Source URL (optional)",
          "required" : false
        }
      },
      "required" : [ "text" ]
    },
    "exports": {
      "properties" : {
        "language" : {
          "type" : "string",
          "description" : "Text Language"
        },
        "type" : {
          "type" : "string",
          "description" : "Sentiment Type"          
        },
        "score" : {
          "type" : "string",
          "description" : "Type Score"
        },
        "mixed" : {
          "type" : "string",
          "description" : "Is Mixed"
        }
      }
    }
  }
}


SentimentText.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  
  if (imports.text) {
    var params = {
      text : imports.text
    };
    
    if (imports.url) {
      params.url = imports.url;
    }
    
    this.pod.post(
      'text/TextGetTextSentiment',
      params,
      sysImports,
      function(err, body) {
        if (err) {
          next(err);
        } else {
          body.docSentiment.language = body.language;
          next(false, body.docSentiment);
        }
      }
    );
  }
}

// -----------------------------------------------------------------------------
module.exports = SentimentText;
