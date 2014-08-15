/**
 *
 * The Bipio Bitly Pod
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

function Expand(podConfig) {
  this.name = 'expand';
  this.description = "Expands a URL";
  this.description_long = "Given a bitly URL or hash (or multiple), returns the target (long) URL";
  this.trigger = false;
  this.singleton = true;
  this.auto = true;
  this.podConfig = podConfig;
}

Expand.prototype = {};

Expand.prototype.getSchema = function() {
  return {
    'imports' : {
      properties : {
        'short_url' : {
          type : 'string',
          description : 'Bitly Short URL'
        },
        'hash' : {
          type : 'string',
          description : 'Bitly URL Hash (optional)'
        }        
      }
    },
    'exports' : {
      properties : {
        'new_hash' : {
          type : 'string',
          description : '1 if new hash'
        },
        'url' : {
          type : 'string',
          description : 'Bitly URL'
        },
        'hash' : {
          type : 'string',
          description : 'Account URL Hash'
        },
        'global_hash' : {
          type : 'string',
          description : 'Global Hash'
        },
        'short_url' : {
          type : 'string',
          description : 'Bitly URL'
        },
        'long_url' : {
          type : 'string',
          description : 'Original URL'
        }
      }
    }
  }
}

Expand.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var uri = 'https://api-ssl.bitly.com/v3/shorten/longUrl?url=';

  if (imports.short_url && '' !== imports.short_url) {
    uri += imports.short_url + '&access_token=' + sysImports.auth.oauth.token;
    pod._httpGet(uri, function(err, bodyJSON) {
      next(err || bodyJSON.status_code !== 200, bodyJSON.data, contentParts, 0);
    });
  }    
}

// -----------------------------------------------------------------------------
module.exports = Expand;