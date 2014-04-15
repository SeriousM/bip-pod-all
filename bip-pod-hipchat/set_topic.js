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

function SetTopic(podConfig) {
  this.name = 'set_topic'; // action name (channel action suffix - "action: boilerplate.simple")
  this.description = 'Set Room Topic', // short description
  this.description_long = 'Set a room\'s topic. Useful for displaying statistics, important links, server status, you name it!', // long description
  this.trigger = false; // this action can trigger
  this.singleton = false; // 1 instance per account (can auto install)
  this.auto = false; // automatically install this action
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

SetTopic.prototype = {};

// SetTopic schema definition
// @see http://json-schema.org/
SetTopic.prototype.getSchema = function() {
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
        "topic" : {
          "type" :  "string",
          "description" : "New topic"
        }
      }
    },
    "exports": {
      "properties" : {
    }
    }
  }
}

SetTopic.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  if (imports.topic && channel.config.room_id) {
    var client = this.pod.getClient(sysImports);
    client.set_topic(
      channel.config.room_id,
      imports.topic,
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
module.exports = SetTopic;