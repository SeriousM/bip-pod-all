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
function PostQuote(podConfig) {
  this.name = 'post_quote';
  this.description = 'New Quote Post';
  this.description_long = 'Create a new Quote Post';
  this.trigger = false;
  this.singleton = false;
  this.podConfig = podConfig;
}

PostQuote.prototype = {};

PostQuote.prototype.getSchema = function() {
  var schema = {
    imports: {
      properties : {
        quote : {
          type : "string",
          description : "Quote"
        },
        source : {
          type : "string",
          description : "Cited Source"
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
PostQuote.prototype.invoke = function(imports, channel, sysImports, contentParts, next) { 
  this.pod._createPost('quote', imports, channel, sysImports, contentParts, next);
}

// -----------------------------------------------------------------------------
module.exports = PostQuote;
