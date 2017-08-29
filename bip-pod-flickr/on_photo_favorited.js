/**
 *
 * The Bipio Flickr Pod
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

function OnPhotoFavorited() {}

OnPhotoFavorited.prototype = {};

OnPhotoFavorited.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    pod = this.pod,
    mime = this.$resource.mime,
    userID = (sysImports.auth.oauth.user_id || JSON.parse(sysImports.auth.oauth.profile).id);

  var args = {
    user_id : userID,
    page : 1,
    per_page: 100
  };

  this.pageStats(sysImports, args, function(err, stats) {
    if (err) {
      next(err);
    } else {
    console.log('STATS ARE ', arguments);

    }
  });

return;

  pod.trackingGet(channel, function(err, since) {
    if (err) {
      next(err);
    } else {
      pod.trackingUpdate(channel, function(err, until) {
        if (!imports.since) {
          imports.min_upload_date = Math.floor(since / 1000);
        }
        self.invoke(imports, channel, sysImports, contentParts, next);
      });
    }
  });
}

OnPhotoFavorited.prototype.pageStats = function(sysImports, args, next) {
  var self = this,
    pod = this.pod;

  pod.getClient(sysImports, function(err, client) {
    if (err) {
      next(err);
    } else {
      client.stats.getPopularPhotos(args, function(err, results) {
        if (err) {
          next(err);
        } else {
console.log(results)
          if (results.pages && results.pages > args.page) {

          }
        }
      });
    }
  });

}


OnPhotoFavorited.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod,
    self = this,
    mime = this.$resource.mime,
    userID = (sysImports.auth.oauth.user_id || JSON.parse(sysImports.auth.oauth.profile).id);

  var args = {
    user_id : userID,
    page : 1,
    per_page: 100
  };



  pod.getClient(sysImports, function(err, client) {
    if (err) {
      next(err);
    } else {
      client.stats.getPopularPhotos(args, function(err, result) {
        var photo;
        if (err) {
          next(err);
        } else {
          for (var i = 0; i < result.photos.photo.length; i++) {
            photo = result.photos.photo[i];
            photo.media_original_url = p.url_o;

            // @todo deprecate option
            if (channel.config.download) {

              (function(photo) {
                pod.getDataDir(channel, self.name, function(err, dataDir) {
                  if (err) {
                    next(err);
                  } else {
                    var fName = p.url_o.split('/').pop(),
                      outfile = dataDir + fName,
                      exports = photo;

                    pod._httpStreamToFile(
                      p.url_o,
                      outfile,
                      function(err, exports, fileStruct) {
                        if (err) {
                          next(err);
                        } else {
                          next(err, exports, {
                            _files : [ fileStruct ]
                            }, fileStruct.size);
                        }
                      },
                      exports,  // export
                      {       // file meta container
                        txId : sysImports.id,
                        localpath : outfile,
                        name : fName,
                        type : mime.lookup(fName),
                        encoding : 'binary'
                      }
                    );
                  }
                });

              })(photo);

            } else {
              next(false, photo);
            }
          }

          if (result.photos.pages) {
            if (result.photos.page < result.photos.pages) {
              args.page++;
              getPhotos(args);
            }
          }
        }
      });
    }
  });


}

// -----------------------------------------------------------------------------
module.exports = OnPhotoFavorited;