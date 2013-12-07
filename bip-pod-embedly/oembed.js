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

function OEmbed(podConfig) {
  this.name = 'oembed';
  this.description = 'Create oEmbed',
  this.description_long = 'oEmbed is Embedly’s basic offering, providing a simple API for embedding content from any URL',
  this.trigger = false; // this action can trigger
  this.singleton = true; // only 1 instance per account (can auto install)
  this.auto = true; // no config, not a singleton but can auto-install anyhow
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

OEmbed.prototype = {};

OEmbed.prototype.getSchema = function() {
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
        },
        "autoplay" : {
          "type" : "boolean",
          "description" : "Autoplay Video"
        },
        "words" : {
          "type" : "integer",
          "description" : "Max Description Words"
        }
      }
    },
    "exports": {
      "properties" : {
        "type" : {
          "type" : "string",
          "description" : "Resource Type"
        },
        "author_name" : {
          "type" : "string",
          "description" : "Author Name"
        },
        "author_url" : {
          "type" : "string",
          "description" : "Author URL"
        },
        "provider_name" : {
          "type" : "string",
          "description" : "Provider Name"
        },
        "provider_url" : {
          "type" : "string",
          "description" : "Provider URL"
        },
        "thumbnail_url" : {
          "type" : "string",
          "description" : "Thumbnail URL"
        },
        "description" : {
          "type" : "string",
          "description" : "URL Description"
        },
        "html" : {
          "type" : "string",
          "description" : "HTML (Rich/Video Types)"
        },
        "width" : {
          "type" : "string",
          "description" : "Width (Rich/Video Types)"
        },
        "height" : {
          "type" : "string",
          "description" : "Height (Rich/Video Types)"
        },
        "url" : {
          "type" : "string",
          "description" : "URL (Photo Types)"
        }
      }
    }
  }
}

/**
 * Invokes (runs) the action.
 */
OEmbed.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
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

        api.oembed(opts, function(err, obj) {
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
module.exports = OEmbed;