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

var ipaddr = require('ipaddr.js');

function Reverse(podConfig) {
  this.name = 'reverse';
  this.description = 'Reverse Lookup',
  this.description_long = 'Reverse resolves an ip address to an array of domain names',
  this.trigger = false; // this action can trigger
  this.singleton = true; // 1 instance per account (can auto install)
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Reverse.prototype = {};

// Reverse schema definition
// @see http://json-schema.org/
Reverse.prototype.getSchema = function() {
  return {
    "imports": {
      "properties" : {
        "ip_addr" : {
          "type" :  "string",
          "description" : "IP Address"
        }
      }
    },
    "exports": {
      "properties" : {
        "ip_first" : {
          "type" : "string",
          "description" : "First IP"
        },
        "ip_all" : {
          "type" : "array",
          "description" : "All Reverse IP's"
        }
      }
    }
  }
}

Reverse.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var tldTools = this.pod.tldTools();
  if (imports.ip_addr) {
    if (!ipaddr.IPv4.isValid(imports.ip_addr) && !ipaddr.IPv6.isValid(imports.ip_addr) ) {
      next('Invalid IP Address ' + imports.ip_addr);
    } else {    
      this.pod.get().reverse(imports.ip_addr, function(err, ip_addrs) {
        if (err) {
          next(err);
        } else {
          next(
            false,
            {
              ip_first : ip_addrs.length ? ip_addrs[0] : '',
              ip_all : ip_addrs
            }
            );
        }
      });
    }
  }
}

// -----------------------------------------------------------------------------
module.exports = Reverse;