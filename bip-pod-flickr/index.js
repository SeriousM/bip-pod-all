/**
 *
 * The Bipio Flickr Pod.
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
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
var Pod = require('bip-pod'),
  Flickr = require('flickrapi');

FlickrPod = new Pod();

FlickrPod.getClient = function(sysImports, next) {
  var podConfig = this.getConfig(),
    profile = JSON.parse(sysImports.auth.oauth.profile)
    options = {
      user_id : profile.id,
      api_key : sysImports.auth.oauth.consumerKey,
      secret : sysImports.auth.oauth.consumerSecret,
      access_token : sysImports.auth.oauth.access_token,
      access_token_secret : sysImports.auth.oauth.secret,
      nobrowser : true
    };
console.log(options);
  Flickr.authenticate(options, next);
};

// -----------------------------------------------------------------------------
module.exports = FlickrPod;
