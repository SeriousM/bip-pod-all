/**
 * 
 * The Bipio Flickr Pod.
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
  request = require('request');
  
Flickr = new Pod({
  name : 'flickr',
  description : 'Flickr',
  description_long : 'Picture galleries available with social networking, chat, groups, and photo ratings',
  /*
  dataSources : [ 
    require('./models/my_media'),
  ],*/
  authType : 'oauth',
  passportStrategy : require('passport-instagram').Strategy,
  config : {
    "oauth": {     
      "consumerKey" : "",
      "consumerSecret" : "",
      "callbackURL" : "", // eg: http://localhost:5000/rpc/oauth/flickr/cb
      "method" : "authenticate"
    }
  }
});


Flickr.add(require('./get_recent.js'));


// -----------------------------------------------------------------------------
module.exports = Flickr;
