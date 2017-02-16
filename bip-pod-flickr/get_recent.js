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

function GetRecent() {}

GetRecent.prototype = {};

GetRecent.prototype.setup = function(channel, accountInfo, next) {
  this.pod.trackingStart(channel, accountInfo, true, next);
}

GetRecent.prototype.teardown = function(channel, accountInfo, next) {
  this.pod.trackingRemove(channel, accountInfo, next);
}

GetRecent.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    pod = this.pod;

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

GetRecent.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod,
    self = this,
    mime = this.$resource.mime,
    userID = (sysImports.auth.oauth.user_id || JSON.parse(sysImports.auth.oauth.profile).id);

  var args = {
    user_id : userID,
    //extras : 'date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o'
    extras : 'date_upload, date_taken, owner_name, original_format, last_update, geo, tags, o_dims, views, media, url_m, url_o',
    page : 1,
    per_page: 1
  };

  if (imports.min_upload_date) {
    args.min_upload_date = imports.min_upload_date;
  }

  pod.getClient(sysImports, function(err, client) {
    if (err) {
      next(err);
    } else {
      client.people.getPhotos(args, function(err, result) {
        var photo;
        if (err) {
          next(err);
        } else {
          for (var i = 0; i < result.photos.photo.length; i++) {
            photo = result.photos.photo[i];
            photo.media_original_url = photo.url_o;

            // @todo deprecate option
            if (imports.download) {

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
module.exports = GetRecent;
