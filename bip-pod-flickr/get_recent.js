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
  this.description = "Get Recent Photos";
  this.description_long = "Returns a list of your latest public photos uploaded to flickr.";
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
        'title' : {
          type : 'string',
          description : 'Title'
        },
        'media_original_url' : {
          type : 'string',
          description : 'Media Original Res URL'
        },
        'tags' : {
          type : 'string',
          description : 'Tags'
        }
      }
    }
  }
}

GetRecent.prototype.setup = function(channel, accountInfo, next) {
  this.pod.trackingStart(channel, accountInfo, true, next);  
}

GetRecent.prototype.teardown = function(channel, accountInfo, next) {
  this.pod.trackingRemove(channel, accountInfo, next);  
}

GetRecent.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod,
    log = this.$resource.log,
    profile = JSON.parse(sysImports.auth.oauth.profile)
  
  pod.trackingGet(channel, function(err, since) {
    if (!err) {
      pod.trackingUpdate(channel, function(err, until) {
        pod.getClient(sysImports, function(err, client) {
          if (err) {
            log(err, channel, 'error');
          } else {
            var args = {
              user_id : profile.id,
              min_upload_date : Math.floor(since / 1000),
              //extras : 'date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o'
              extras : 'date_upload, date_taken, owner_name, original_format, last_update, geo, tags, o_dims, views, media, url_m, url_o',
              page : 1,
              per_page: 1
            };

            function getPhotos(args) {
              client.people.getPhotos(args, function(err, result) {
                var p;
                if (err) {
                  log(err, channel, 'error');    
                } else {
                  for (var i = 0; i < result.photos.photo.length; i++) {
                    p = result.photos.photo[i];
                    next(false, {
                      title : p.title,
                      media_original_url : p.url_o,
                      tags : p.tags
                    });
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
            
            getPhotos(args);
          }
        });
      });
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = GetRecent;