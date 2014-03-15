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

function Format(podConfig) {
  this.name = 'format';
  this.description = 'Format a Time',
  this.description_long = 'Converts a UTC or string time representation into the given format',
  this.trigger = false; // this action can trigger
  this.singleton = true; // 1 instance per account (can auto install)
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Format.prototype = {};

// Format schema definition
// @see http://json-schema.org/
Format.prototype.getSchema = function() {
  return {
    "imports": {
      "properties" : {
        "time" : {
          "type" :  "string",
          "description" : "Time to Format"
        },
        "format" : {
          "type" :  "string",
          "description" : "Format to apply"
        }
      }
    },
    "exports": {
      "properties" : {
        "time_formatted" : {
          "type" : "string",
          "description" : "Formatted Time"
        }
      }
    }
  }
}

Format.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  if (imports.time) {
    var time = this.pod.get(imports.time);
    if (time.isValid()) {
      var exports = {}
      if (imports.format) {
        exports.time_formatted = time.format(imports.format)
      } else {
        exports.time_formatted = time.toString();
      }

      next(false, exports);

    } else {
      next('Invalid Date at ' + time.invalidAt());
    }
  } else {
    // silent passthrough
    next(false, {});
  }
}

// -----------------------------------------------------------------------------
module.exports = Format;