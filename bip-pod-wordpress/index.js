/**
 * 
 * The Bipio Wordpress Pod.  Wordpress Actions and Content Emitters
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
    Wordpress = new Pod({
        name : 'wordpress',
        description : 'Wordpress',
        description_long : 'WordPress is an open source CMS, often used as a blog publishing application powered by PHP and MySQL',
        authType : 'oauth',
        passportStrategy : require('passport-wordpress').Strategy,
        config : {
            "oauth": {
                "consumerKey" : "",
                "consumerSecret" : ""
            }
        }
    });

Wordpress.add(require('./new_post.js'));

// -----------------------------------------------------------------------------
module.exports = Wordpress;
