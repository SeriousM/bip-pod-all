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