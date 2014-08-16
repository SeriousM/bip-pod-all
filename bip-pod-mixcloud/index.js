/**
 * 
 * The Bipio MixCloud Pod.  MixCloud Actions and Content Emitters
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
  request = require('request');
  
MixCloud = new Pod({
  name : 'mixcloud',
  description : 'MixCloud',
  description_long : 'Great radio, for everyone. Listen to the best DJs and radio presenters in the world.',
  dataSources : [ 
    require('./models/track_favorite'),
  ],
  authType : 'oauth',
  passportStrategy : require('passport-mixcloud').Strategy,
  config : {
    "oauth": {
      "clientID" : "",
      "clientSecret" : ""
    }
  }
});

MixCloud._apiURL = 'https://api.mixcloud.com';

MixCloud.add(require('./get_favorites.js'));
MixCloud.add(require('./oembed.js'));

// -----------------------------------------------------------------------------
module.exports = MixCloud;
