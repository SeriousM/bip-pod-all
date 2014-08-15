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

function Whois(podConfig) {
  this.name = 'whois';
  this.description = 'Get Whois',
  this.description_long = 'Extracts Whois Data from a URL',
  this.trigger = false; // this action can trigger
  this.singleton = true; // 1 instance per account (can auto install)
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Whois.prototype = {};

// Whois schema definition
// @see http://json-schema.org/
Whois.prototype.getSchema = function() {
  return {
    "imports": {
      "properties" : {
        "url" : {
          "type" :  "string",
          "description" : "URL"
        }
      }
    },
    "exports": {
      "properties" : {
        "whois_body" : {
          "type" : "string",
          "description" : "Raw Whois Data"
        }
      }
    }
  }
}

Whois.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var tldTools = this.pod.tldTools();
  if (imports.url) {
    tldTools.whois(
      imports.url,
      {
        onSuccess : function(whoisData) {          
          next(
            false,
            {
              whois_body : whoisData.data_utf8_raw
            }
          );
        },
        onFail : function(err, fqdn) {
          next(err);
        }
      }
    );
  }
}

// -----------------------------------------------------------------------------
module.exports = Whois;