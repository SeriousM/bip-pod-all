/**
 *
 * The Bipio Tumblr Pod.  Tumblr Actions and Content Emitters
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
tumblr = require('tumblr.js'),
Tumblr = new Pod();

Tumblr.rpc = function(action, method, sysImports, options, channel, req, res) {
  var podConfig = this.getConfig();
  if (method == 'user_info') {

    var client = new tumblr.Client({
      consumer_key : podConfig.oauth.consumerKey,
      consumer_secret : podConfig.oauth.consumerSecret,
      token : sysImports.auth.oauth.token,
      token_secret : sysImports.auth.oauth.secret
    });

    client.userInfo(function(err, resp) {
      if (err) {
        res.send(err, 500);
      } else {
        res.send(resp);
      }
    });

  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

Tumblr._createPost = function(type, imports, channel, sysImports, contentParts, next) {
  var log = this.log,
    user = JSON.parse(sysImports.auth.oauth.profile).response.user,
    podConfig = this.getConfig();

  var client = new tumblr.Client({
    consumer_key : sysImports.auth.oauth.consumerKey || podConfig.oauth.consumerKey,
    consumer_secret : sysImports.auth.oauth.consumerSecret ||  podConfig.oauth.consumerSecret,
    token : sysImports.auth.oauth.token,
    token_secret : sysImports.auth.oauth.secret
  });

  imports.state = (channel.config.state && '' !== channel.config.state) ?
  channel.config.state :
  'draft';

  imports.format = (channel.config.format && '' !== channel.config.format) ?
  channel.config.format :
  user.default_post_format;
  var url = channel.config.url;

  if (-1 === url.indexOf('.')) {
    url += '.tumblr.com';
  }

  client[type](url, imports, function(err, response) {
    if (err) {
      log(err, channel, 'error');
    }
    next(err, response);
  });
}

// -----------------------------------------------------------------------------
module.exports = Tumblr;

