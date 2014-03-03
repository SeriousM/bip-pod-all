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
function PostPhoto(podConfig) {
  this.name = 'post_photo';
  this.description = 'New Photo Post';
  this.description_long = 'Create a new Photo Post';
  this.trigger = false;
  this.singleton = false;
  this.podConfig = podConfig;
}

PostPhoto.prototype = {};

PostPhoto.prototype.getSchema = function() {
  var schema = {
    imports: {
      properties : {
        caption : {
          type : "string",
          description : "Caption"
        },
        link : {
          type : "string",
          description : "Link"
        },
        source : {
          type : "string",
          description : "Image Source URL"
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
PostPhoto.prototype.invoke = function(imports, channel, sysImports, contentParts, next) { 
  
  if (contentParts._files) {
    for (var i = 0; i < contentParts._files.length; i++) {     
      var localImports = app._.clone(imports);
      delete localImports.source;
      delete localImports.link;
      
      localImports.data = contentParts._files[i].localpath;     
      this.pod._createPost('photo', localImports, channel, sysImports, contentParts, next);
    }
  } else {
    this.pod._createPost('photo', imports, channel, sysImports, contentParts, next);
  }
}
// -----------------------------------------------------------------------------
module.exports = PostPhoto;
