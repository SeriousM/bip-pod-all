/**
 *
 * The Bipio MixCloud Pod
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
	  var since_date = new Date(imports.since*1000);
	  var since = since_date.getUTCFullYear() + "-" + (since_date.getUTCMonth()+1) + "-" + since_date.getUTCDate() + "+" + since_date.getUTCHours() + "%3A" +
	  since_date.getUTCMinutes() + "%3A" + since_date.getUTCSeconds();
    url += '&since=' + since;
  }

  if (imports.until) {
	  var until_date = new Date(imports.until*1000);
	  var until = until_date.getUTCFullYear() + "-" + (until_date.getUTCMonth()+1) + "-" + until_date.getUTCDate() + "+" + until_date.getUTCHours() + "%3A" +
	  until_date.getUTCMinutes() + "%3A" + until_date.getUTCSeconds()
	  url += '&until=' + until;
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