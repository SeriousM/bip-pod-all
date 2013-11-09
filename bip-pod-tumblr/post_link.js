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
function PostLink(podConfig) {
  this.name = 'post_link';
  this.description = 'New Link Post';
  this.description_long = 'Create a new Link Post';
  this.trigger = false;
  this.singleton = false;
  this.podConfig = podConfig;
}

PostLink.prototype = {};

PostLink.prototype.getSchema = function() {
  var schema = {
    imports: {
      properties : {
        title : {
          type : "string",
          description : "Link Title"
        },
        url : {
          type : "string",
          description : "URL"
        },
        description : {
          type : "string",
          description : "Link Summary"
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
PostLink.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  this.pod._createPost('link', imports, channel, sysImports, contentParts, next);
}

// -----------------------------------------------------------------------------
module.exports = PostLink;
