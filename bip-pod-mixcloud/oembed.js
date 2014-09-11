/**
 *
 * The Bipio MixCloud Pod
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

function OEmbed(podConfig) {
  this.name = 'oembed';
  this.title = "MixCloud oEmbed";
  this.description = "Converts any MixCloud entity to its oEmbed representation";
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
      },
      "required" : [ "url" ]
    },
    'exports' : {
      properties : {
        'type' : {
          type : 'string',
          description : 'oEmbed Type'
        },
        'provider_name' : {
          type : 'string',
          description : 'Provider Name (mixcloud)'
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

OEmbed.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var uri = '/oembed?format=json',
    pod = this.pod,
    opts = {}

  if (imports.url && '' !== imports.url) {

    opts.url = imports.url;
    pod._testAndSet(imports, opts, 'maxwidth');
    pod._testAndSet(imports, opts, 'maxheight');
    pod._testAndSet(imports, opts, 'autoplay');
    pod._testAndSet(imports, opts, 'words');

    var getStr = '';
    for (var k in opts) {
      if (opts.hasOwnProperty(k)) {
        getStr += '&' + k + '=' + opts[k];
      }
    }

    pod._httpGet('http://www.mixcloud.com' + uri + getStr, function(err, bodyJSON) {
      next(err, bodyJSON);
    });
  }
}

// -----------------------------------------------------------------------------
module.exports = OEmbed;