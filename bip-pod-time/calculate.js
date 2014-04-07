/**
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2014 CloudSpark pty ltd http://www.cloudspark.com.au
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

function Calculate(podConfig) {
  this.name = 'calculate';
  this.description = 'Calculate a Time',
  this.description_long = 'Calculates a time from a simple natural language expression, eg: "in 2 days"',
  this.trigger = false; // this action can trigger
  this.singleton = true; // 1 instance per account (can auto install)
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Calculate.prototype = {};

// Calculate schema definition
// @see http://json-schema.org/
Calculate.prototype.getSchema = function() {
  return {
    "imports": {
      "properties" : {
        "expression" : {
          "type" :  "string",
          "description" : "Date Expression"
        },
        "format" : {
          "type" :  "string",
          "description" : "Date Format"
        }
      }
    },
    "exports": {
      "properties" : {
        "date_calculated" : {
          "type" : "string",
          "description" : "Calculateted Time"
        }
      }
    }
  }
}

Calculate.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod;
  if (imports.expression) {
    try {
      var exports = {},
        d = Date.create(imports.expression);

      if (imports.format) {
        exports.data_calculated = pod.format(d, imports.format);
      } else {
        exports.data_calculated = d.getTime();
      }

      next(false, exports);
    } catch (e) {
      next(e.message);
    }
    
  } else {
    // silent passthrough
    next(false, {});
  }
}

// -----------------------------------------------------------------------------
module.exports = Calculate;