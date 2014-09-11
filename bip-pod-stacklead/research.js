/**
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

function Research(podConfig) {
  this.name = 'research';
  this.title = 'Research A Lead',
  this.description = 'Delivers lead research results to your inbox or configured webhook',
  this.trigger = false;
  this.singleton = true;
  this.podConfig = podConfig;
}

Research.prototype = {};

Research.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "delivery_method" : {
          "type" :  "string",
          "description" : "Delivery Method",
          oneOf : [ {
            "$ref" : "#/config/definitions/delivery_method"
          }]
        }
      },
      definitions : {
        delivery_method : {
          "description" : "Delivery Method",
          "enum" : [ "email" , "webhook" ],
          "enum_label" : [ "Email" , "Web Hook" ],
          'default' : "email"
        }
      }
    },
    "imports": {
      "properties" : {
        "email_address" : {
          "type" :  "string",
          "description" : "Email Address"
        }
      },
      "required" : [ "email_address" ]
    },
    "exports": {
      "properties" : {
        "message" : {
          "type" :  "string",
          "description" : "Response Message"
        }
      }
    }
  }
}

Research.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var httpGet = this.$resource._httpGet,
    deliveryMethod = channel.config.delivery_method || this.getSchema().config.definitions.delivery_method['default'];

  if (imports.email_address) {
    httpGet(
      'https://stacklead.com/api/leads?email='
        + imports.email_address
        + '&delivery_method=' + deliveryMethod
        + '&api_key='
        + sysImports.auth.issuer_token.username,
      function(err, resp) {
        next(err, resp);
      }
    );
  }
}

// -----------------------------------------------------------------------------
module.exports = Research;