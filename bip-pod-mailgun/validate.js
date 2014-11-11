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

// @see http://documentation.mailgun.com/api-complaints.html#complaints

function Validate(podConfig) {
  this.name = 'validate';
  this.title = 'Validate an Email Address';
  this.description = 'Validate an Email Address';
  this.trigger = true;
  this.singleton = false;
  this.auto = false;
  this.podConfig = podConfig;
}

Validate.prototype = {};

Validate.prototype.getSchema = function() {
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
        "address" : {
          "type" :  "string",
          "description" : "An email address to validate"
        },
        "api_key" : {
          "type" :  "string",
          "description" : "If you can not use HTTP Basic Authentication (preferred), you can pass your api_key in as a parameter"
        }
      },
    },
    "exports": {
      "properties" : {
        "is_valid" : {
          "type" :  "boolean",
          "description" : "is the address a valid email address"
        },
        "address" : {
          "type" :  "string",
          "description" : "email address"
        }
      }
    }
  }
}

Validate.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
  $resource = this.$resource;

  
  this.pod.getClient(sysImports, channel.config.domain)
    .address()
    .validate(imports, function (err, resp) {
      if (err) {
        next(err);
      } else {
        next(err, resp); 
      }
    });
}

// -----------------------------------------------------------------------------
module.exports = Validate;
