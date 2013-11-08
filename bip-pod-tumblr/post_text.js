/**
 *
 * The Bipio Tumblr Pod.  status_update action definition
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
var tumblr = require('tumblr.js');

function PostText(podConfig) {
  this.name = 'post_text';
  this.description = 'New Text Post';
  this.description_long = 'Create a new Text Post';
  this.trigger = false;
  this.singleton = false;
  this.podConfig = podConfig;
}

PostText.prototype = {};

PostText.prototype.getSchema = function() {
  return {
    config : {
      properties : {
        url: {
          type: "string",
          description: 'Blog URL eg: blog.tumblr.com',
          optional: false,
          unique : true
        }
      }
    },
    'exports' : {
      properties : {
    }
    },
    "imports": {
      properties : {
        "title" : {
          type : "string",
          "description" : "Post Title"
        },
        "body" : {
          type : "string",
          "description" : "Post Body"
        }
      }
    }
  };
}

/**
 * Invokes (runs) the action.
 *
 */
PostText.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var log = this.$resource.log,
  user = sysImports.auth.oauth.profile.response.user;
  var client = new tumblr.Client({
    consumer_key : this.podConfig.oauth.consumerKey,
    consumer_secret : this.podConfig.oauth.consumerSecret,
    token : sysImports.auth.oauth.token,
    token_secret : sysImports.auth.oauth.secret
  });

  var struct = {
    type : 'text',
    state : 'draft',
    format : (channel.config.format && '' !== channel.config.format) ? channel.config.format : user.default_post_format,

    title : imports.title,
    body : imports.body
  }

  client.text(channel.config.url, struct,function(err, response) {
    if (err) {
      log(err, channel, 'error');
    }
    next(err, response);
  });
}

// -----------------------------------------------------------------------------
module.exports = PostText;
