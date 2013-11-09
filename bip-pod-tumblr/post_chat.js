/**
 *
 * The Bipio Tumblr Pod.
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
function PostChat(podConfig) {
  this.name = 'post_chat';
  this.description = 'New Chat Post';
  this.description_long = 'Create a new Chat Post';
  this.trigger = false;
  this.singleton = false;
  this.podConfig = podConfig;
}

PostChat.prototype = {};

PostChat.prototype.getSchema = function() {
  var schema = {
    imports: {
      properties : {
        title : {
          type : "string",
          description : "Chat Title"
        },
        conversation : {
          type : "string",
          description : "Chat Transcript",
          optional : false
        }        
      }
    }
  };
  return this.pod._decoratePostSchema(schema);
}

/**
 * Invokes (runs) the action.
 *
 */
PostChat.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  this.pod._createPost('chat', imports, channel, sysImports, contentParts, next);
}

// -----------------------------------------------------------------------------
module.exports = PostChat;
