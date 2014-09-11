/**
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

function TZConvert(podConfig) {
  this.name = 'tz_convert';
  this.title = 'Convert a Time',
  this.description = 'Converts a UTC or string time representation into the given TimeZone and Format',
  this.trigger = false; // this action can trigger
  this.singleton = false; // 1 instance per account (can auto install)
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

TZConvert.prototype = {};

// TZConvert schema definition
// @see http://json-schema.org/
TZConvert.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "time_zone" : {
          "type" :  "string",
          "description" : "Timezone to Convert To"
        }
      }
    },
    "imports": {
      "properties" : {
        "time" : {
          "type" :  "string",
          "description" : "Time to Convert"
        },
        "time_zone" : {
          "type" :  "string",
          "description" : "Timezone to Convert To"
        },
        "format" : {
          "type" :  "string",
          "description" : "Format to Apply"
        }
      },
      "required" : [ "time" ]
    },
    "exports": {
      "properties" : {
        "time_converted" : {
          "type" : "string",
          "description" : "Convertted Time"
        }
      }
    }
  }
}

TZConvert.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var convertTo = imports.time_zone || channel.config.time_zone;

  if (imports.time && convertTo) {
    var time = this.pod.get(imports.time);

    if (time.isValid()) {
      var exports = {}

      time = time.tz(convertTo);
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
module.exports = TZConvert;