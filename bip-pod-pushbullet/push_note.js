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

function PushNote(podConfig) {
  this.name = 'push_note';
  this.description = 'Push a Note',
  this.description_long = 'Push a Note to one of your connected devices',
  this.trigger = false;
  this.singleton = false;
  this.auto = false;
  this.podConfig = podConfig;
}

PushNote.prototype = {};

// PushNote schema definition
// @see http://json-schema.org/
PushNote.prototype.getSchema = function() {
  return {
    'config' : {
      properties : {
        'device_iden' : {
          type : 'string',
          description : 'Device ID',
          oneOf : [
            {
              '$ref' : '/renderers/my_devices#devices/{iden}'
            }            
          ],
          label : {
            '$ref' : '/renderers/my_devices#devices/{nickname}'
          }
        }
      }
    },
    "imports": {
      "properties" : {
        "title" : {
          "type" :  "string",
          "description" : "Title"
        },
        "body" : {
          "type" :  "string",
          "description" : "Body"
        }
      }
    },
    "exports": {
      "properties" : {
        "iden" : {
          "type" : "string",
          "description" : "ID"
        },
        "type" : {
          "type" : "string",
          "description" : "Push Type"
        },
        "title" : {
          "type" : "string",
          "description" : "Title"
        },
        "body" : {
          "type" : "string",
          "description" : "Body"
        },
        "created" : {
          "type" : "string",
          "description" : "Created Time"
        },
        "active" : {
          "type" : "boolean",
          "description" : "Active"
        },
        "dismissed" : {
          "type" : "boolean",
          "description" : "Dismissed"
        },
        "owner_iden" : {
          "type" : "string",
          "description" : "Owner ID"
        },
        "target_device_iden" : {
          "type" : "string",
          "description" : "Target Device ID"
        },
        "sender_iden" : {
          "type" : "string",
          "description" : "Sender ID"
        },
        "sender_email_normalized" : {
          "type" : "string",
          "description" : "Sender Email"
        },
        "receiver_iden" : {
          "type" : "string",
          "description" : "Receiver ID"
        },
        "receiver_email_normalized" : {
          "type" : "string",
          "description" : "Receiver Email"
        }
      }
    }
  }
}

PushNote.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {  
  if (imports.title || imports.body) {    
    var params = {
      title : imports.title,
      body : imports.body,
      type : 'note',
      device_iden : channel.config.device_iden
    };

    this.pod.pushbulletRequestParsed(
      'pushes',
      params,
      sysImports,
      function(err, body) {
        next(err, body || {});
      },
      'POST'
    );
  }
}

// -----------------------------------------------------------------------------
module.exports = PushNote;
