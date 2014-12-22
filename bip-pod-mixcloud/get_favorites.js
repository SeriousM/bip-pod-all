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

function GetFavorites() {}

GetFavorites.prototype = {};

GetFavorites.prototype.setup = function(channel, accountInfo, next) {
  this.pod.trackingStart(channel, accountInfo, true, next);
}

GetFavorites.prototype.teardown = function(channel, accountInfo, next) {
  this.pod.trackingRemove(channel, accountInfo, next);
}

GetFavorites.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod,
    self = this;

  pod.trackingGet(channel, function(err, since) {
    if (err) {
      next(err);
    } else {
      pod.trackingUpdate(channel, function(err, until) {
        if (err) {
          next(err);
        } else {
          imports.since = since;
          imports.until = until;

          self.invoke(imports, channel, sysImports, contentParts, function(err, mix) {
            if (err) {
              next(err);
            } else {
              next(false, mix);
            }
          });
        }
      });
    }
  });
}

/**
 * Invokes (runs) the action.
 */
GetFavorites.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var log = this.$resource.log,
    pod = this.pod;

  var url = pod._apiURL + '/' + (sysImports.auth.oauth.username || JSON.parse(sysImports.auth.oauth.profile).username)
      + '/favorites?access_token=' + sysImports.auth.oauth.access_token;

  if (imports.since) {
    url += '&since=' + imports.since;
  }

  if (imports.until) {
   url += '&until=' + imports.until;
  }

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

// -----------------------------------------------------------------------------
module.exports = GetFavorites;