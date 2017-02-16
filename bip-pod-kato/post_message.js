/**
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function PostMessage(podConfig) {
  this.name = 'post_message';
  this.title = 'Post a Message',
  this.description = 'Posts a new message to a Kato room via the HTTP Post Integration',
  this.trigger = false;
  this.singleton = false;
  this.auto = false;
  this.podConfig = podConfig;
}

PostMessage.prototype = {};

PostMessage.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "from" : {
          "type" :  "string",
          "description" : "From Label"
        },
        "renderer" : {
          "type" :  "string",
          "description" : "Text Renderer",
          oneOf : [
            {
              "$ref" : "#/config/definitions/renderer"
            }
          ]
        },
        "room_id" : {
          "type" :  "string",
          "description" : "Room ID"
        },
        "color" : {
          "type" :  "string",
          "description" : "Default HTML Color"
        }
      },
      "definitions" : {
        "renderer" : {
          "description" : "Text Renderer",
          "enum" : [ "default" , "code", "markdown" ],
          "enum_label" : ["Default", "Code", "Markdown" ],
          "default" : "default"
        }
      },
      "required" : [ "room_id" ]
    },
    "imports": {
      "properties" : {
        "color" : {
          "type" :  "string",
          "description" : "HTML Color"
        },
        "text" : {
          "type" :  "string",
          "description" : "Message Text"
        }
      },
      "required" : [ "text" ]
    }
  }
}

PostMessage.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var payload,
    color,
    url = 'https://api.kato.im/rooms/';

  if (imports.room_id && imports.text) {
    url += imports.room_id + '/simple';

    payload = {
      text : imports.text,
      renderer : imports.renderer
    };

    color = imports.color || imports.color;
    if (color) {
      payload.color = color;
    }

    if (imports.from) {
      payload.from = imports.from;
    }

    this.$resource._httpPost(url, payload, function(err, body) {
      next(err, {});
    }, {
      'Content-Type' : 'application/json'
    });

  }
}

// -----------------------------------------------------------------------------
module.exports = PostMessage;