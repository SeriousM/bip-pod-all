/**
 *
 * The Bipio Soundcloud Pod.  get_favorites action definition
 * ---------------------------------------------------------------
 *  Download Sounds I've Favorited
 * ---------------------------------------------------------------
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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