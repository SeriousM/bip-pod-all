/**
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

function CurrentPrice(podConfig) {
  this.name = 'current_price';
  this.title = 'Current Price',
  this.description = 'Triggers whenever the BitCoin Price is Updated',
  this.trigger = true;
  this.socket = true;
  this.singleton = true;
  this.auto = true;
  this.podConfig = podConfig;
}

CurrentPrice.prototype = {};

// Simple schema definition
// @see http://json-schema.org/
CurrentPrice.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
      }
    },
    "imports": {
      "properties" : {
      }
    },
    "exports": {
      "properties" : {
        "time" : {
          "type" : "object",
          "description" : "Time Formats",
          "properties" : {
            "updated" : {
              "type" : "string",
              "description" : "Last Updated"
            },
            "updatedISO" : {
              "type" : "string",
              "description" : "Last Updated (ISO)"
            },
            "updateduk" : {
              "type" : "string",
              "description" : "Last Updated (UK)"
            }
          }
        },
        "disclaimer" : {
          "type" : "string",
          "description" : "Disclaimer"
        },
        "bpi" : {
          "type" : "object",
          "description" : "BPI Object",
          // @todo use model $ref
          "properties" : {
            "USD" : {
              "properties" : {
                "code" : {
                  "type" : "string",
                  "description" : "Currency Code"
                },
                "symbol" : {
                  "type" : "string",
                  "description" : "Symbol"
                },
                "rate" : {
                  "type" : "string",
                  "description" : "Rate"
                },
                "description" : {
                  "type" : "string",
                  "description" : "Description"
                },
                "rate_float" : {
                  "type" : "number",
                  "description" : "Rate Float"
                },
              }
            },
            "GBP" : {
              "properties" : {
                "code" : {
                  "type" : "string",
                  "description" : "Currency Code"
                },
                "symbol" : {
                  "type" : "string",
                  "description" : "Symbol"
                },
                "rate" : {
                  "type" : "string",
                  "description" : "Rate"
                },
                "description" : {
                  "type" : "string",
                  "description" : "Description"
                },
                "rate_float" : {
                  "type" : "number",
                  "description" : "Rate Float"
                },
              }
            },
            "EUR" : {
              "properties" : {
                "code" : {
                  "type" : "string",
                  "description" : "Currency Code"
                },
                "symbol" : {
                  "type" : "string",
                  "description" : "Symbol"
                },
                "rate" : {
                  "type" : "string",
                  "description" : "Rate"
                },
                "description" : {
                  "type" : "string",
                  "description" : "Description"
                },
                "rate_float" : {
                  "type" : "number",
                  "description" : "Rate Float"
                },
              }
            }
          }
        },
        "usd_float" : {
          "type" : "number",
          "description" : "USD Rate"
        },
        "gbp_float" : {
          "type" : "number",
          "description" : "GBP Rate"
        },
        "eur_float" : {
          "type" : "number",
          "description" : "EUR Rate"
        }
      }
    }
  }
}

CurrentPrice.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  this.pod.getLastPrice(next);
}

// -----------------------------------------------------------------------------
module.exports = CurrentPrice;
