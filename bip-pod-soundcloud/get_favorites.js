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
var moment = require('moment');

function GetFavorites(podConfig) {
  this.name = 'get_favorites';
  this.title = "Get Favorites";
  this.description = "Retrieves the sounds you've favorited, exporting track data and (optionally) the track itself";
  this.trigger = true;
  this.singleton = false;
  this.auto = true;
  this.podConfig = podConfig;
}

GetFavorites.prototype = {};

GetFavorites.prototype.getSchema = function() {
  return {
    'config' : {
      properties : {
        'download' : {
          type : 'boolean',
          description : "Download Files",
          "default" : false
        }
      }
    },
    'exports' : {
      properties : {
        'title' : {
          type : 'string',
          description : 'Track Title'
        },
        'artist' : {
          type : 'string',
          description : 'Artist Name'
        },
        'genre' : {
          type : 'string',
          description : 'Music Genre'
        },
        'download_url' : {
          type : 'string',
          description : 'Direct Download URL'
        },
        'label_name' : {
          type : 'string',
          description : 'Releasing Label Name'
        },
        'permalink_url' : {
          type : 'string',
          description : 'Track Permalink URL'
        },
        'artwork_url' : {
          type : 'string',
          description : 'Track Artwork URL (JPEG)'
        },
        'description' : {
          type : 'string',
          description : 'Track Description'
        }
      }
    }
  }
}

/**
 * Invokes (runs) the action.
 */
GetFavorites.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var uri = '/me/favorites',
    self = this,
    token = sysImports.auth.oauth.token,
    modelName = this.$resource.getDataSourceName('track_favorite'),
    resource = this.$resource,
    dao = resource.dao;

  this.pod.getDataDir(channel, 'get_favorites', function(err, dataDir) {
    if (!err) {
      self.pod._httpGet(self.pod._apiURL + uri + '.json?oauth_token=' + token, function(err, data) {
        var numTracks = 0,
          exports = {},
          track,
          outfile,
          fName;

        if (!err) {
          numTracks = data.length;
          for (var i = 0; i < numTracks; i++) {
            track = data[i];
            (function(track, channel, next) {
              var nowTime = moment().unix();

              // push to tracking
              dao.find(
                modelName,
                {
                  owner_id : channel.owner_id,
                  channel_id : channel.id,
                  track_id : track.id
                },
                function(err, result) {
                  var now = moment().unix(),
                    pubdate;

                  if (err) {
                    log(err, channel, 'error');

                  // already tracked favorites get skipped
                  } else if (!result) {
                    var model = dao.modelFactory(modelName, {
                      owner_id : channel.owner_id,
                      channel_id : channel.id,
                      track_id : track.id,
                      last_update : nowTime
                    });

                    dao.create(model);

                    if (channel.config.download) {
                      if (track.downloadable) {
                        fName = track.title + '.mp3';
                        outfile = dataDir + fName;
                        self.pod._httpStreamToFile(
                          track.download_url + '?oauth_token=' + token,
                          outfile,
                          function(err, exports, fileStruct) {
                            if (!err) {
                              exports.artist = exports.user.username;
                            } else {
                              resource.log(err, channel);
                            }
                            next(err, exports, {
                              _files : [ fileStruct ]
                              });
                          },
                          track,  // export
                          {       // file meta container
                            txId : sysImports.id,
                            localpath : outfile,
                            name : fName,
                            type : 'mp3',
                            encoding : 'binary'
                          }
                          );
                      } else {
                        resource.log(track.title + ' NOT DOWNLOADABLE', channel);
                      }
                    } else {
                      next(false, track);
                    }
                  }
                }
              );
            })(track, channel, next);
          }
        } else {
          next(err, exports, []);
        }
      });
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = GetFavorites;