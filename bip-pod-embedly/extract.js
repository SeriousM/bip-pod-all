/**
 *
 * The Bipio Embedly Pod
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

function Extract(podConfig) {
  this.name = 'extract';
  this.description = 'Extract Page',
  this.description_long = 'The Extract endpoint is designed to provide users with important information from each link including the article text, keywords, related links, and even video embeds.',
  this.trigger = false; // this action can trigger
  this.singleton = true; // only 1 instance per account (can auto install)
  this.auto = true; // no config, not a singleton but can auto-install anyhow
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Extract.prototype = {};

Extract.prototype.getSchema = function() {
  return {
    "imports": {
      "properties" : {
        "url" : {
          "type" : "string",
          "description" : "URL"
        },
        "maxwidth" : {
          "type" : "integer",
          "description" : "Max Width"
        },
        "maxheight" : {
          "type" : "integer",
          "description" : "Max Height"
        }
      }
    },
    "exports": {
      "properties" : {
        "url" : {
          "type" : "string",
          "description" : "URL"
        },
        "title" : {
          "type" : "string",
          "description" : "Title"
        },
        "description" : {
          "type" : "string",
          "description" : "Description"
        },
        "favicon_url" : {
          "type" : "string",
          "description" : "Favicon URL"
        },
        "content" : {
          "type" : "string",
          "description" : "Extracted Content"
        }
      }
    }
  }
}

/**
 * Invokes (runs) the action.
 */
Extract.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var log = this.$resource.log,
    pod = this.pod;

  if (imports.url && '' !== imports.url) {
    this.pod.api(channel, sysImports, function(err, api) {
      if (err) {
        next(err);
      } else {
        var opts = {
          url : imports.url ,
          format : 'json'
        };

        pod._testAndSet(imports, opts, 'maxwidth');
        pod._testAndSet(imports, opts, 'maxheight');
        pod._testAndSet(imports, opts, 'autoplay');
        pod._testAndSet(imports, opts, 'words');        

        api.extract(opts, function(err, obj) {
          if (err) {
            log(err, channel, 'error');
          } else {              
            for (var i = 0; i < obj.length; i++) {
              next(false, obj[i]);  
            }              
          }
        }
        );
      }      
    });
  }  
}

// -----------------------------------------------------------------------------
module.exports = Extract;