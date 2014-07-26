/**
 * 
 * Pusher Actions and Content Emitters
 * 
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2014 CloudSpark pty ltd http://www.cloudspark.com.au
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
    PusherClient = require( 'pusher' ),
    Pusher = new Pod({
        name : 'pusher',
        description : 'Pusher',
        description_long : '<a href="http://pusher.com">Pusher</a> is a hosted API for quickly, easily and securely adding scalable realtime functionality to web and mobile apps.',
        authType : "issuer_token",
        authMap : {
          username : 'App ID',
          key : "Key",
          password : "Secret"
        }
    });

Pusher.getClient = function(sysImports) {
  return new PusherClient({
    appId : sysImports.auth.issuer_token.username,
    key : sysImports.auth.issuer_token.key,
    secret : sysImports.auth.issuer_token.password
  });
}

// Include any actions
Pusher.add(require('./trigger_event.js'));

// -----------------------------------------------------------------------------
module.exports = Pusher;
