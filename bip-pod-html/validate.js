/**
 *
 * The Bipio Validate Pod.  boilerplate sample action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
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

function Validate(podConfig) {
  this.name = 'validate'; // action name (channel action suffix - "action: boilerplate.simple")
  this.title = 'W3C Validate', // short description
  this.description = 'Validates HTML with the W3C Validation Service, exporting the results', // long description
  this.trigger = false; // this action can trigger
  this.singleton = true; // 1 instance per account (can auto install)
  this.auto = false; // automatically install this action
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

var W3CURL = 'http://validator.w3.org/check?output=json&uri=';

Validate.prototype = {};

Validate.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "aggregate" : {
          "type" :  "string",
          "description" : "Error Aggregation Type",
          oneOf : [
            {
              "$ref" : "#/config/definitions/aggregate_type"
            }
          ]
        }
      },
      definitions : {
        aggregate_type : {
          "description" : "Error Aggregation Type",
          "enum" : [ "none" , "json", "text" ],
          "enum_label" : [ "None (Export each message)" , "Raw JSON", "Text Normalized" ],
          'default' : 'json'
        }
      }
    },
    "imports": {
      "properties" : {
        "url" : {
          "type" :  "string",
          "description" : "URL"
        }
      },
      "required" : [ "url" ]
    },
    "exports": {
      "properties" : {
        "message" : {
          "type" :  "string",
          "description" : "Validation Message"
        },
        "lastLine" : {
          "type" :  "integer",
          "description" : "Last Line"
        },
        "lastColumn" : {
          "type" :  "integer",
          "description" : "Column Number"
        },
        "explanation" : {
          "type" :  "string",
          "description" : "Explanation"
        }
      }
    }
  }
}


Validate.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var GetResource = this.$resource._httpGet;

  if (imports.url) {
    GetResource(W3CURL + imports.url, function(err, result, headers, status) {
      if ('none' === channel.config.aggregate) {
        for (var i = 0; i < result.messages.length; i++) {
          next(false, result.messages[i]);
        }
      } else if ('json' === channel.config.aggregate) {
        next(false, { message : JSON.stringify(result.messages) } );

      } else if ('text' === channel.config.aggregate) {
        var textOutput = '', m;
        for (var i = 0; i < result.messages.length; i++) {
          m = result.messages[i];
          textOutput += (m.type + ':L' + m.lastLine + ',C' + m.lastColumn + ':' + m.message + m.explanation + '\n');
        }

        next(err, { message : textOutput })
      }
    });
  }

}

// -----------------------------------------------------------------------------
module.exports = Validate;