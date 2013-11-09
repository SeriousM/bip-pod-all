/**
 *
 * The Bipio Tumblr Pod.  Tumblr Actions and Content Emitters
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
var Pod = require('bip-pod'),
tumblr = require('tumblr.js'),
Tumblr = new Pod({
  name : 'tumblr',
  description : 'Tumblr',
  description_long : 'Tumblr is a microblogging platform and social networking website. The service allows users to post multimedia and other content to a short-form blog.',
  authType : 'oauth',
  passportStrategy : require('passport-tumblr').Strategy,
  config : {
    "oauth": {
      "consumerKey" : "",
      "consumerSecret" : ""
    }
  }
});

//
Tumblr._decoratePostSchema = function(schema) {

  if (!schema.config) {
    schema.config = {
      properties : {}
    }
  }

  if (!schema.config.properties) {
    schema.config.properties = {};
  }

  schema.config.properties.url = {
    type: "string",
    description: 'Blog URL eg: blog.tumblr.com',
    optional: false,
    unique : true
  };

  schema.config.properties.state = {
    type : 'string',
    description : 'Default State',
    oneOf : [
    {
      "$ref" : "#/definitions/state"
    }
    ]
  };

  if (!schema.config.definitions) {
    schema.config.definitions = {};
  }

  schema.config.definitions.state = {
    "description" : "Post State",
    "enum" : [ "published" , "draft", "queue", "private" ],
    "enum_label" : ["Published", "Draft", "Queued", "Private"],
    "default" : "draft"
  };

  if (!schema.exports) {
    schema.exports = {
      properties : {}
    }
  }

  if (!schema.exports.properties) {
    schema.exports.properties = {};
  }

  schema.exports.properties.id = {
    type : "integer",
    description : "Post ID"
  };

  return schema;
}

Tumblr._createPost = function(type, imports, channel, sysImports, contentParts, next) {
  var log = this.log,
    user = sysImports.auth.oauth.profile.response.user,
    podConfig = this.getConfig();

  var client = new tumblr.Client({
    consumer_key : podConfig.oauth.consumerKey,
    consumer_secret : podConfig.oauth.consumerSecret,
    token : sysImports.auth.oauth.token,
    token_secret : sysImports.auth.oauth.secret
  });

  imports.state = (channel.config.state && '' !== channel.config.state) ?
    channel.config.state :
    'draft';

  imports.format = (channel.config.format && '' !== channel.config.format) ? 
    channel.config.format : 
    user.default_post_format;
  client[type](channel.config.url, imports, function(err, response) {
    if (err) {
      log(err, channel, 'error');
    }
    next(err, response);
  });
}

Tumblr.add(require('./post_text.js'));
Tumblr.add(require('./post_photo.js'));
Tumblr.add(require('./post_quote.js'));
Tumblr.add(require('./post_link.js'));
Tumblr.add(require('./post_chat.js'));
Tumblr.add(require('./post_audio.js'));
Tumblr.add(require('./post_video.js'));

// -----------------------------------------------------------------------------
module.exports = Tumblr;

