/**
 * 
 * The Bipio Embedly Pod.  Embedly Actions and Content Emitters
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
  em = require('embedly');
  
Embedly = new Pod({
  name : 'embedly',
  description : 'Embedly',
  description_long : 'With Embedly you can embed media from over 250 providers, and surface popular content with analytics. You can gain deeper insights on the articles shared on your site, and improve load times with image optimization.',
  authType : 'issuer_token',
    authMap : {
      password : 'API Key'
    }
});

Embedly.api = function(channel, sysImports, cb) {
  var self = this;
  new em({ key : sysImports.auth.issuer_token.password }, function(err, api) {
    if (err) {
      self.log(err, channel, 'error');
    } 
    
    cb(err, api);    
  });
}

Embedly.add(require('./oembed.js'));
Embedly.add(require('./extract.js'));

// -----------------------------------------------------------------------------
module.exports = Embedly;
