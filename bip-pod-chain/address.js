/**
 *
 * @author Scott Tuddenhman <scott@wot.io>
 * Copyright (c) 2010-2014 WoT.IO Inc http://wot.io
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


var ChainNode = require('chain-node');

function Address(podConfig) {
  this.name = 'address';
  this.title = 'Address';
  this.description = 'Returns the associated data for a given Bitcoin Address';
  this.trigger = false;
  this.singleton = false;
  this.podConfig = podConfig;

Address.prototype = {};

Address.prototype.getSchema = function() {
  return {
    "imports": {
      "properties" : {
        "address" : {
          "type" :  "string",
          "description" : "Bitcoin Address"
        }
     },
      "required" : [ "address" ]
    },
    "exports": {
      "properties" : {
        "hash" : {
          "type" :  "string",
          "description" : "Address ID"
        },
        "balance" : {
          "type" :  "number",
          "description" : "Address Balance"
        },
        "received" : {
          "type" :  "number",
          "description" : "Received"
        },
        "sent" : {
          "type" : "number",
          "description" : "Sent"
        },
        "unconfirmed_received" : {
          "type" :  "number",
          "description" : "Unconfirmed Received"
        },
        "unconfirmed_sent" : {
          "type" : "number",
          "description" : "Unconfirmed Sent"
        },
        "unconfirmed_balance" : {
          "type" : "number",
          "description" : "Unconfirmed Balance"
        }
      }
    }
  }
}

Address.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

    if (imports.address) {

        ChainNode.getAddress(imports.address, function(err, resp) {
            console.log(resp);
            next(err || resp.status_code !== 200, resp.data, contentParts, 0);
        });

    };

}
// -----------------------------------------------------------------------------
module.exports = Address;
