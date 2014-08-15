/**
 * 
 * The Bipio Imgur Pod.  Imgur Actions and Content Emitters
 * 
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2013 Michael Pearson https://github.com/mjpearson
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
    Imgur = new Pod({
        name : 'imgur',
        description : 'Imgur',
        description_long : 'Imgur is used to share photos with social networks and online communities, and has the funniest pictures from all over the Internet.',
        authType : 'none', // @todo hybrid auth types. Action level auth schemas
        passportStrategy : require('passport-imgur').Strategy,        
        config : {
            // application outh
            "oauth" : {        
                "clientID" : "",
                "clientSecret" : "",
                "callbackURL" : ""
            }
        }
    });

Imgur.add(require('./image_upload_anon.js'));

// -----------------------------------------------------------------------------
module.exports = Imgur;
