/**
 *
 * The Bipio Flickr Pod
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

function GetRecent(podConfig) {
  this.name = 'get_recent';
  this.description = "My Recent Photos";
  this.description_long = "Returns a list of the latest public photos uploaded to flickr.";
  this.trigger = true;
  this.singleton = true;
  this.auto = true;
  this.podConfig = podConfig;
}

GetRecent.prototype = {};

GetRecent.prototype.getSchema = function() {
  return {
    'config' : {
      properties : {
    }
    },
    'imports' : {
      properties : {
    }
    },
    'exports' : {
      properties : {
        'file_name' : {
          type : 'string',
          description : 'File Name'
        },
        'caption' : {
          type : 'string',
          description : 'Media Caption'
        },
        'filter' : {
          type : 'string',
          description : 'Filter Name'
        },
        'media_url' : {
          type : 'string',
          description : 'Media Standard Res URL'
        }
      }
    }
  }
}

GetRecent.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod,
  log = this.$resource.log;

  pod.getDataDir(channel, this.name, function(err, dataDir) {
  });
}

// -----------------------------------------------------------------------------
module.exports = GetRecent;