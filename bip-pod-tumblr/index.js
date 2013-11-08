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

Tumblr.add(require('./post_text.js'));

// -----------------------------------------------------------------------------
module.exports = Tumblr;
