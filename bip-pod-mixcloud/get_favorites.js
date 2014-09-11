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

function GetFavorites(podConfig) {
  this.name = 'get_favorites';
  this.title = 'Get MixCloud Favorites',
  this.description = 'Retrieves MixCloud Favorites',
  this.trigger = true; // this action can trigger
  this.singleton = true; // only 1 instance per account (can auto install)
  this.auto = true; // no config, not a singleton but can auto-install anyhow
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

GetFavorites.prototype = {};

GetFavorites.prototype.getSchema = function() {
  return {
    "imports": {
      "properties" : {
      }
    },
    "exports": {
      "properties" : {
        "name" : {
          "type" : "string",
          "description" : "Mix Name"
        },
        "tags" : {
          "type" : "array",
          "description" : "Mix Tags"
        },
        "key" : {
          "type" : "string",
          "description" : "Key"
        },
        "url" : {
          "type" : "string",
          "description" : "Mix URL"
        },
        "pictures_xl" : {
          "type" : "string",
          "description" : "Extra Large Picture URL"
        },
        "pictures_thumbnail" : {
          "type" : "string",
          "description" : "Thumbnail URL"
        },
        "user_username" : {
          "type" : "string",
          "description" : "Username"
        },
        "user_name" : {
          "type" : "string",
          "description" : "User Actual Name"
        },
        "user_url" : {
          "type" : "string",
          "description" : "User URL"
        },
        "user_picture_xl" : {
          "type" : "string",
          "description" : "User XL Picture"
        }
      }
    }
  }
}

GetFavorites.prototype.setup = function(channel, accountInfo, next) {
  this.pod.trackingStart(channel, accountInfo, true, next);
}

GetFavorites.prototype.teardown = function(channel, accountInfo, next) {
  this.pod.trackingRemove(channel, accountInfo, next);
}

/**
 * Invokes (runs) the action.
 */
GetFavorites.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var log = this.$resource.log,
    pod = this.pod;

  (function(channel, sysImports, next) {
    pod.trackingGet(channel, function(err, since) {
      if (!err) {
        pod.trackingUpdate(channel, function(err, until) {
          if (!err) {
            var url = pod._apiURL + '/' + sysImports.auth.oauth.profile.username
                + '/favorites?access_token=' + sysImports.auth.oauth.token
                + '&since=' + since
                + '&until=' + until;

            pod._httpGet(url, function(err, bodyJSON) {
              if (!err && bodyJSON.data && bodyJSON.data.length > 0 ) {
                var exports, tags;
                for (var i = 0; i < bodyJSON.data.length; i++) {
                  tags = [];
                  exports = bodyJSON.data[i];

                  for (var t = 0; t < exports.tags.length; t++) {
                    tags.push(exports.tags[t].name);
                  }
                  exports.tags = tags;

                  exports.pictures_xl = exports.pictures.extra_large;
                  exports.pictures_thumbnail = exports.pictures.thumbnail;

                  exports.user_username = exports.user.username;
                  exports.user_name = exports.user.name;
                  exports.user_url = exports.user.url;

                  next(false, exports);
                }
              }
            });
          }
        });
      }
    });
  })(channel, sysImports, next);
}

// -----------------------------------------------------------------------------
module.exports = GetFavorites;