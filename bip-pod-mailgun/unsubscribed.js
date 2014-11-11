/**
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

// @see http://documentation.mailgun.com/api-unsubscribes.html#unsubscribes

function Unsubscribed(podConfig) {
  this.name = 'unsubscribed';
  this.title = 'Triggers when an email is unsubscribed';
  this.description = 'Triggers when an email is unsubscribed';
  this.trigger = true;
  this.singleton = false;
  this.auto = false;
  this.podConfig = podConfig;
}

Unsubscribed.prototype = {};

Unsubscribed.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "domain" : {
          "type" : "string",
          "description" : "Domain",
          "oneOf" : [
            {
              "$ref" : '/renderers/get_domains#items/{name}'
            }
          ]
        }
      }
    },
    "imports": {
      "properties" : {
        "limit" : {
          "type" :  "number",
          "description" : "max number of addressess to return (100 by default)"
        },
        "skip" : {
          "type" :  "number",
          "description" : "number of addresses to skip (0 by default)"
        }
      },
    },
    "exports": {
      "properties" : {
        "tag" : {
          "type" :  "string",
          "description" : "tag for unsubscribe list"
        },
        "address" : {
          "type" :  "string",
          "description" : "unsubscribed email address"
        }
      }
    }
  }
}

Unsubscribed.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
  $resource = this.$resource;


  this.pod.getClient(sysImports, channel.config.domain)
    .unsubscribes()
    .list(imports, function (err, addrs) {
      var a;
      if (err) {
        next(err);
      } else {
        for (var i = 0; i < addrs.items[i].length; i++) {
            $resource.dupFilter(addrs.items[i], 'address', channel, sysImports, function(err, addr) {
                  next(err, addr);
            });
        }
      }
    });
}

// -----------------------------------------------------------------------------
module.exports = Unsubscribed;
