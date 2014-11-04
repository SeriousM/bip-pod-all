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

// @see http://documentation.mailgun.com/api-sending.html#sending

function Send(podConfig) {
  this.name = 'send';
  this.title = 'Send an Email';
  this.description = 'Send an Email';
  this.trigger = false;
  this.singleton = false;
  this.auto = false;
  this.podConfig = podConfig;
}

Send.prototype = {};

Send.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "from" : {
          "type" :  "string",
          "description" : "Default From Address"
        },
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
        "from" : {
          "type" :  "string",
          "description" : "From Address"
        },
        "to" : {
          "type" :  "string",
          "description" : "To Address"
        },
        "cc" : {
          "type" :  "string",
          "description" : "Cc"
        },
        "bcc" : {
          "type" :  "string",
          "description" : "Bcc"
        },
        "subject" : {
          "type" :  "string",
          "description" : "Subject"
        },
        "text" : {
          "type" :  "string",
          "description" : "Text"
        },
        "html" : {
          "type" :  "string",
          "description" : "HTML"
        }
      },
      "required" : [ "from", "to" ]
    },
    "exports": {
      "properties" : {
        "message" : {
          "type" :  "string",
          "description" : "Queue Message"
        },
        "id" : {
          "type" :  "string",
          "description" : "Message ID"
        }
      }
    }
  }
}

Send.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  this.pod.getClient(sysImports, channel.config.domain)
    .messages()
    .send(imports, function (err, body) {
      next(err, body);
    });
}

// -----------------------------------------------------------------------------
module.exports = Send;
