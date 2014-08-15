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

function Lookup(podConfig) {
  this.name = 'lookup';
  this.description = 'Resolve a Domain',
  this.description_long = 'Resolves a domain into the first found A (IPv4) or AAAA (IPv6) record',
  this.trigger = false; // this action can trigger
  this.singleton = true; // 1 instance per account (can auto install)
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Lookup.prototype = {};

// Lookup schema definition
// @see http://json-schema.org/
Lookup.prototype.getSchema = function() {
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
        "ip" : {
          "type" : "string",
          "description" : "IP Address"
        },
        "ip_version" : {
          "type" : "string",
          "description" : "IP Version (4 or 6)"
        }
      }
    }
  }
}

Lookup.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var tldTools = this.pod.tldTools();
  if (imports.url) {
    var tokens = tldTools.extract(imports.url),
    domain = tokens.inspect.getDomain();

    if (!domain) {
      next('Could not extract domain for ' + imports.url);
    } else {
      this.pod.get().lookup(domain, function(err, ip, version) {
        if (err) {
          next(err);
        } else {
          next(
            false,
            {
              ip : ip,
              version : version
            }
            );
        }
      });
    }

  }
}

// -----------------------------------------------------------------------------
module.exports = Lookup;