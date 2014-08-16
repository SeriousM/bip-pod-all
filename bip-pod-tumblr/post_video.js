/**
 *
 * The Bipio Tumblr Pod.
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
function PostVideo(podConfig) {
  this.name = 'post_video';
  this.description = 'New Video Post';
  this.description_long = 'Create a new Video Post';
  this.trigger = false;
  this.singleton = false;
  this.podConfig = podConfig;
}

PostVideo.prototype = {};

PostVideo.prototype.getSchema = function() {
  var schema = {
    imports: {
      properties : {
        caption : {
          type : "string",
          description : "Caption"
        },
        embed : {
          type : "string",
          description : "HTML embed code"
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
PostVideo.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  this.pod._createPost('video', imports, channel, sysImports, contentParts, next);
}

// -----------------------------------------------------------------------------
module.exports = PostVideo;
