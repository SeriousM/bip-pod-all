/**
 *
 * The Bipio HipChat Pod
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2014 CloudSpark pty ltd http://www.cloudspark.com.au
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

function CreateWebHook(podConfig) {
  this.name = 'create_webhook'; // action name (channel action suffix - "action: boilerplate.simple")
  this.description = 'Create Webhook', // short description
  this.description_long = 'Creates a new webhook', // long description
  this.trigger = false; // this action can trigger
  this.singleton = false; // 1 instance per account (can auto install)
  this.auto = false; // automatically install this action
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

CreateWebHook.prototype = {};

// CreateWebHook schema definition
// @see http://json-schema.org/
CreateWebHook.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        'room_id' : {
          type : 'string',
          description : 'Room ID',
          oneOf : [
          {
            '$ref' : '/renderers/room_list/{id}'
          }
          ],
          label : {
            '$ref' : '/renderers/my_pages/{name}'
          }
        }
      }
    },
    "imports": {
      "properties" : {
        "url" : {
          "type" :  "string",
          "description" : "Hook URL"
        },
        "pattern" : {
          "type" :  "string",
          "description" : "pattern"
        },
        "event" : {
          "type" :  "string",
          "description" : "Event Type",
          oneOf : [
          {
            "$ref" : "#/imports/definitions/room_events"
          }
          ]
        },
        "name" : {
          "type" :  "string",
          "description" : "Hook Name"
        }
      },
      "definitions" : {
        "room_events" : {
          "description" : "Room Event Types",
          "enum" : [ "room_message" , "room_notification", "room_exit", "room_enter", "room_topic_change" ],
          "enum_label" : ["Message", "Notification", "Exit", "Enter", "Change Topic"],
          "default" : "room_message"
        }
      }
    },
    "exports": {
      "properties" : {
        "hook_id" : {
          "type" :  "integer",
          "description" : "Webhook ID"
        },
        "link_self" : {
          "type" :  "string",
          "description" : "HipChat webhook URL"
        }
      }
    }
  }
}

CreateWebHook.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var client = this.pod.getClient(sysImports);
  client.create_webhook(
    channel.config.room_id,
    imports,
    function(err, result) {
      var exports = {};
      if (err) {
        err = result;
      } else {
        exports.hook_id = result.id;
        exports.link_self = result.links.self;
      }

      next(err, exports);
    }
    );

}

// -----------------------------------------------------------------------------
module.exports = CreateWebHook;