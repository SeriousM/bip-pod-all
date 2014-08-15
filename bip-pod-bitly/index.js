/**
 * 
 * The Bipio Bitly Pod.  Bitly Actions and Content Emitters
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
var Pod = require('bip-pod');
  
Bitly = new Pod({
  name : 'bitly',
  description : 'Bitly',
  description_long : 'Offers URL redirection service with real-time link tracking.',
  authType : 'oauth',
  passportStrategy : require('passport-bitly').Strategy,
  config : {
      "oauth": {
         "clientID" : "",
         "clientSecret" : "",
         "callbackURL" : ""
      }
  }
});


Bitly.add(require('./shorten.js'));
Bitly.add(require('./expand.js'));

// -----------------------------------------------------------------------------
module.exports = Bitly;
