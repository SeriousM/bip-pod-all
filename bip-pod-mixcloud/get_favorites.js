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

/**
 * Invokes (runs) the action.
 */
GetFavorites.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var log = this.$resource.log,
    pod = this.pod;

  pod.trackingGet(channel, function(err, since) {
    if (!err) {
      pod.trackingUpdate(channel, function(err, until) {
        if (!err) {
          var url = pod._apiURL + '/' + JSON.parse(sysImports.auth.oauth.profile).username
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

}

// -----------------------------------------------------------------------------
module.exports = GetFavorites;