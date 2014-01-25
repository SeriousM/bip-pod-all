/**
 *
 * The Bipio MailChimp Pod (!?!)
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
MailChimpAPI = require('mailchimp').MailChimpAPI,
MailChimp = new Pod({
  name : 'mailchimp', // pod name (action prefix)
  description : 'MailChimp', // short description
  description_long : 'MailChimp is an email marketing service provider. It is a web-based application, although data can be downloaded and for some features there is an offline application.', // long description
  authType : 'oauth',
  passportStrategy : require('passport-mailchimp').Strategy,
  config : {
    "oauth": {
      "clientID" : "",
      "clientSecret" : ""
    }
  }
});

MailChimp.getAPI = function(sysImports) {  
  // fudge the api key for the mailchimp package.
  // need to inject   
  var api = new MailChimpAPI(
      ' -' + JSON.parse(sysImports.auth.oauth.profile).dc,       
      {    
        version : '2.0'
    }
  );
  api.apiKey = sysImports.auth.oauth.token;
  return api;
}

MailChimp.callMC = function(section, method, args, sysImports, next) {
  this.getAPI(sysImports).call(section, method, args, next);
}

MailChimp.getList = function(sysImports, next) {
  var api = this.getAPI();

  api.call('lists', 'list', {
    apikey : sysImports.auth.oauth.token
  }, next);
}

// Include any actions
MailChimp.add(require('./add_subscriber.js'));

// -----------------------------------------------------------------------------
module.exports = MailChimp;
