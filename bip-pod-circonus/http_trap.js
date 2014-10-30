/**
 *
 * @author Michael Pearson <michael@bip.io>
 * Copyright (c) 2010-2014 WoT.IO
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

function HTTPTrap(podConfig) {
  this.name = 'http_trap';
  this.title = 'HTTP Trap';
  this.description = 'Sends JSON object data to a HTTP Trap';
  this.trigger = false;
  this.singleton = false;
  this.auto = false;
  this.podConfig = podConfig;
}

HTTPTrap.prototype = {};

HTTPTrap.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "trap_url" : {
          "type" : "string",
          "description" : "Trap URL"
        }
      },
      "required" : [ "trap_url"]
    },
    "imports": {
      "properties" : {
        "data" : {
          "type" : "mixed",
          "description" : "JSON Data Object"
        }
      },
      "required" : [ "data"]
    },
    "exports": {
      "properties" : {
      }
    }
  }
}

HTTPTrap.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource;

  if (imports.data && channel.config.trap_url) {
    try {
      this.$resource._httpPut(
        channel.config.trap_url,
        app.helper.deriveObject(imports.data),
        function(err, resp) {
          next(err, resp);
        },
        {},
        {
          strictSSL : false
        }
      );
    } catch (e) {
      next(e);
    }
  }
}

// -----------------------------------------------------------------------------
module.exports = HTTPTrap;
