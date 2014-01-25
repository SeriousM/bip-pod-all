/**
 *
 * AddSubscriber
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

function AddSubscriber(podConfig) {
  this.name = 'add_subscriber'; // action name (channel action suffix - "action: boilerplate.simple")
  this.description = 'Add a Subscriber', // short description
  this.description_long = 'Any Email address this channel receives will be added as a subscriber to an existing list', // long description
  this.trigger = false; // this action can trigger
  this.singleton = false; // 1 instance per account (can auto install)
  this.auto = false; // automatically install this action
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

AddSubscriber.prototype = {};

// AddSubscriber schema definition
// @see http://json-schema.org/
AddSubscriber.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "list_id" : {
          "type" :  "string",
          "description" : "List ID"
        }
      }
    },
    "imports": {
      "properties" : {
        "email" : {
          "type" :  "string",
          "description" : "Email Address"
        }
      }
    },
    "exports": {
      "properties" : {
        "email" : {
          "type" : "string",
          "description" : "Added Email Address"
        },
        "euid" : {
          "type" : "string",
          "description" : "Email Unique ID"
        },
        "leid" : {
          "type" : "string",
          "description" : "List Email Unique ID"
        }
      }
    },
    'renderers' : {
      'get_lists' : {
        description : 'Retrieve Lists',
        description_long : 'Retrieves all lists for your account',
        contentType : DEFS.CONTENTTYPE_json
      }     
    }
  }
}

AddSubscriber.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  if (method === 'get_lists') {
    res.contentType(this.getSchema().renderers[method].contentType);
    res.send('world');
  } else {
    res.send(404);
  }
}

AddSubscriber.prototype.setup = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

AddSubscriber.prototype.teardown = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

AddSubscriber.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var log = this.$resource.log,
    args;

  if (channel.config.list_id && imports.email) {  
    args = {
      id : channel.config.list_id,
      email : {
        email : imports.email
      }
    };
    this.pod.callMC('lists', 'subscribe', args, sysImports, function(err, response) {    
      next(err, response);
    });
  }
}

// -----------------------------------------------------------------------------
module.exports = AddSubscriber;