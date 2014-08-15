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

function AddEvent(podConfig) {
  this.name = 'add_event';
  this.description = 'Add an Event',
  this.description_long = 'Adds KeenIO Event data to a Project Id',
  this.trigger = false;
  this.singleton = false;
  this.auto = false;
  this.podConfig = podConfig;
}

AddEvent.prototype = {};

AddEvent.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "project_id" : {
          "type" :  "string",
          "description" : "Project ID"
        }
      }
    },
    "imports": {
      "properties" : {
        "collection_name" : {
          "type" :  "string",
          "description" : "Collection Name"
        },
        "event" : {
          "type" :  "string",
          "description" : "Event Object (JSON String)"
        }
      }
    },
    "exports": {
      "properties" : {
        "created" : {
          "type" : "boolean",
          "description" : "Event Created"
        }
      }
    }
  }
}

AddEvent.prototype.invoke = function(imports, channel, sysImports, contentParts, next) { 
  var client = this.pod.getClient(sysImports, channel.config.project_id);
  
  if (imports.collection_name && imports.event) {
    try {
      client.addEvent(imports.collection_name, JSON.parse(imports.event), function(err, res) {
        next(err, res)
      });
    } catch (e) {
      next(e);
    }
  }  
}

// -----------------------------------------------------------------------------
module.exports = AddEvent;
