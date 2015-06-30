/**
 *
 * The Bipio Soundcloud Pod.  get_favorites action definition
 * ---------------------------------------------------------------
 *  Download Sounds I've Favorited
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

GetFavorites.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource;
    token = sysImports.auth.oauth.access_token,
    dataDir = this.pod.getDataDir(channel, 'get_favorites');
    self = this;

  this.invoke(imports, channel, sysImports, contentParts, function(err, track) {
    if (err) {
      next(err);
    } else {
      var outfile, fName;

      $resource.dupFilter(track, 'id', channel, sysImports, function(err, track) {
        if (err) {
          next(err);
        } else {
          if (imports.download && track.downloadable) {
            fName = track.title + '.mp3';
            outfile = dataDir + '/' + fName;
            self.pod._httpStreamToFile(
              track.download_url + '?oauth_token=' + token,
              outfile,
              function(err, fileStruct) {
                if (!err) {
                  track.artist = track.user.username;
                  contentParts._files.push(fileStruct);
                }

                next(err, exports, contentParts, fileStruct.size);
              }
            );
          } else {
            next(false, track);
          }
        }

      });
    }
  });
}

/**
 * Invokes (runs) the action.
 */
GetFavorites.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var uri = '/me/favorites',
    self = this,
    token = sysImports.auth.oauth.access_token;

  self.pod._httpGet(self.pod._apiURL + uri + '.json?oauth_token=' + token, function(err, data) {
    var numTracks = 0;
    if (err) {
      next(err);
    } else {
      numTracks = data.length;
      for (var i = 0; i < numTracks; i++) {
        next(false, data[i]);
      }
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = GetFavorites;