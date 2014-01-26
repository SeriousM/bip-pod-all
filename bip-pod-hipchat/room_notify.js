/**
 *
 * The Bipio HipChat Pod
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2013 CloudSpark pty ltd http://www.cloudspark.com.au
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

function RoomNotify(podConfig) {
  this.name = 'room_notify'; // action name (channel action suffix - "action: boilerplate.simple")
  this.description = 'Send a message to a room', // short description
  this.description_long = 'Send a message to a room', // long description
  this.trigger = false; // this action can trigger
  this.singleton = false; // 1 instance per account (can auto install)
  this.auto = false; // automatically install this action
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

RoomNotify.prototype = {};

// RoomNotify schema definition
// @see http://json-schema.org/
RoomNotify.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "room_id" : {
          "type" :  "string",
          "description" : "Room ID"
        },
        "room_token" : {
          "type" :  "string",
          "description" : "Room Notification Token"
        }
      }
    },
    "imports": {
      "properties" : {
        "message" : {
          "type" :  "string",
          "description" : "Message"
        }
      }
    },
    "exports": {
      "properties" : {        
      }
    }
  }
}

RoomNotify.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  if (imports.message && channel.config.room_id && channel.config.room_token) {
    var client = this.pod.getClient(sysImports);
    client.notify(
      channel.config.room_id, 
      { 
        message : imports.message,
        token : channel.config.room_token
      },
      function(err, result) {
        if (err) {
          err = result;
        }        
        next(err, {});
      }
    );
  }  
}

// -----------------------------------------------------------------------------
module.exports = RoomNotify;