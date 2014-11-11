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

// @see http://documentation.mailgun.com/api-complaints.html#spam-complaints

function Complaints(podConfig) {
  this.name = 'complaints';
  this.title = 'On A Complaint';
  this.description = 'Triggers when an someone complains that an email messages is spam';
  this.trigger = true;
  this.singleton = false;
  this.auto = false;
  this.podConfig = podConfig;
}

Complaints.prototype = {};

Complaints.prototype.getSchema = function() {
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
      },
      "required" : [ "domain" ]
    },
    "imports": {
      "properties" : {
      },
    },
    "exports": {
      "properties" : {
        "created_at" : {
          "type" :  "string",
          "description" : "time complaint was registered"
        },
        "address" : {
          "type" :  "string",
          "description" : "complaint email address"
        }
      }
    }
  }
}

Complaints.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
  $resource = this.$resource;

  this.pod.getClient(sysImports, channel.config.domain)
    .complaints()
    .list(imports, function (err, addrs) {
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
module.exports = Complaints;
