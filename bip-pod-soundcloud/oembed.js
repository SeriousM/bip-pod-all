/**
 *
 * The Bipio Soundcloud Pod
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
var request = require('request');
function OEmbed(podConfig) {
  this.name = 'oembed';
  this.description = "SoundCloud oEmbed";
  this.description_long = "Converts any SoundCloud entity to its oEmbed representation";
  this.trigger = false;
  this.singleton = true;
  this.auto = true;
  this.podConfig = podConfig;
}

OEmbed.prototype = {};

OEmbed.prototype.getSchema = function() {
  return {
    'config' : {
      properties : {
      }
    },
    'imports' : {
      properties : {
        'url' : {
          type : 'string',
          description : 'URL'
        },
        'maxwidth' : {
          type : 'string',
          description : 'Max Width'
        },
        'maxheight' : {
          type : 'string',
          description : 'Max Height'
        },
        'auto_play' : {
          type : 'boolean',
          description : 'Auto Play'
        },
        'show_comments' : {
          type : 'boolean',
          description : 'Show Comments'
        },
        'color' : {
          type : 'string',
          description : 'Primary Color Value (hex)'
        }
      }
    },
    'exports' : {
      properties : {
        'type' : {
          type : 'string',
          description : 'oEmbed Type'
        },
        'provider_name' : {
          type : 'string',
          description : 'Provider Name (soundcloud)'
        },
        'provider_url' : {
          type : 'string',
          description : 'Provider URL'
        },
        'title' : {
          type : 'string',
          description : 'Title'
        },
        'html' : {
          type : 'string',
          description : 'oEmbed HTML'
        }
      }
    }
  }
}

/**
 * Invokes (runs) the action.
 */
OEmbed.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var uri = '/oembed?format=json', 
    log = this.$resource.log;

  if (imports.url && '' !== imports.url) {    
    request.get(
      self.pod._apiURL + uri + '&url=' + imports.url,
      function(error, res, body) {                    
        if (error) {
          log(body, channel, 'error');
        }
        
        next(error, body);                  
      });
  }
}

// -----------------------------------------------------------------------------
module.exports = OEmbed;