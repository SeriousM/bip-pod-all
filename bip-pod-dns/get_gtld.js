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

function GetGTLD(podConfig) {
  this.name = 'get_gtld';
  this.title = 'Get GTLD',
  this.description = 'Extracts GTLD and Subdomain tokens from a URL.  Works with any URI Scheme.',
  this.trigger = false; // this action can trigger
  this.singleton = true; // 1 instance per account (can auto install)
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

GetGTLD.prototype = {};

// GetGTLD schema definition
// @see http://json-schema.org/
GetGTLD.prototype.getSchema = function() {
  return {
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
        "gtld" : {
          "type" : "string",
          "description" : "Generic Top Level Domain"
        },
        "domain" : {
          "type" : "string",
          "description" : "Domain"
        },
        "subdomain" : {
          "type" : "string",
          "description" : "Sub-Domain"
        },
        "protocol" : {
          "type" : "string",
          "description" : "URI Scheme"
        },
        "host" : {
          "type" : "string",
          "description" : "Host Name"
        }
      }
    }
  }
}

GetGTLD.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var tldTools = this.pod.tldTools();
  if (imports.url) {
    var tokens = tldTools.extract(imports.url);
    var exports = {
      gtld : tokens.tld ? tokens.tld : tokens.domain,
      domain : tokens.domain,
      subdomain : tokens.subdomain,
      protocol : tokens.url_tokens.protocol.replace(':', ''),
      host : tokens.url_tokens.hostname
    };

    next(false, exports);
  }
}

// -----------------------------------------------------------------------------
module.exports = GetGTLD;