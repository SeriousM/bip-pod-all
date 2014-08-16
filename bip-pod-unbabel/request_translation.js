/**
 *
 * The Bipio Unbabel Pod
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2013 Michael Pearson https://github.com/mjpearson
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

function RequestTranslation(podConfig) {
  this.name = 'request_translation'; // action name (channel action suffix - "action: unbabel.simple")
  this.description = 'Request Translation', // short description
  this.description_long = 'Requests a Translation from Unbabel', // long description
  this.trigger = false; // this action can trigger
  this.singleton = false; // 1 instance per account (can auto install)
  this.auto = false; // automatically install this action
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

RequestTranslation.prototype = {};

// RequestTranslation schema definition
// @see http://json-schema.org/
RequestTranslation.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "target_language" : {
          "type" :  "string",
          "description" : "Target Language"
        },
        "instructions" : {
          "type" :  "string",
          "description" : "Client instructions for the translator"
        }
      }
    },
    "imports": {
      "properties" : {
        "text" : {
          "type" :  "string",
          "description" : "Text to Translate"
        },
        "source_language" : {
          "type" :  "string",
          "description" : "Source Language"
        },
        "formality" : {
          "type" :  "string",
          "description" : "The tone that should be used in the translation"
        },
        "topics" : {
          "type" :  "string",
          "description" : "List of Topics for the text"
        }
      }
    },
    "exports": {
      "properties" : {
        "status" : {
          "type" : "string",
          "description" : "Status"
        },
        "formality" : {
          "type" :  "string",
          "description" : "The tone that should be used in the translation"
        },
        "text" : {
          "type" : "string",
          "description" : "Original Text"
        },
        "target_language" : {
          "type" : "string",
          "description" : "Target Language"
        },
        "source_language" : {
          "type" : "string",
          "description" : "Source Language"
        },
        "uid" : {
          "type" : "string",
          "description" : "Transaction ID"
        },
        "price_euro" : {
          "type" : "string",
          "description" : "Price &euro;EUR"
        }                ,
        "topics" : {
          "type" :  "string",
          "description" : "List of Topics for the text"
        }
      }
    },
    'renderers' : {
      'update_status' : {
        description : 'Update Tracking Status',
        description_long : 'Updates the internally tracked status for a translation UID to something new',
        contentType : DEFS.CONTENTTYPE_JSONL
      }     
    }
  }
}

// RPC/Renderer accessor - /rpc/render/channel/{channel id}/hello
RequestTranslation.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  if (method === 'update_status') {
    res.contentType(this.getSchema().renderers[method].contentType);
    res.send('world');
  } else {
    res.send(404);
  }
}

// channel presave setup
// setup data sources
RequestTranslation.prototype.setup = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

// channel destroy/teardown
// you can remove any stored data here
RequestTranslation.prototype.teardown = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

RequestTranslation.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var modelName = this.$resource.getDataSourceName('track_translation'),
    pod = this.pod,    
    payload = imports;
    payload.target_language = channel.config.target_language;
     
  pod.requestPOST('translation', payload, sysImports, function(err, response) {
    if (!err) {
      response.price_eur = response.price;
    }
    next(err, response);
  }); 
 
}

// -----------------------------------------------------------------------------
module.exports = RequestTranslation;