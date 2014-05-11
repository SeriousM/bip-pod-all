/**
 * 
 * The Bipio Alchemy Pod.  Alchemy Actions and Content Emitters
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
  request = require('request'),
  FormData = require('form-data'),
  Alchemy = new Pod({
        name : 'alchemy', // pod name (action prefix)
        description : 'AlchemyAPI', // short description
        description_long : 'Text Analysis by <a href="http://www.alchemyapi.com/" target="_blank">AlchemyAPI</a>. The World\'s Most Popular Natural Language Processing Service.',
        authType : 'issuer_token',
        authMap : {
            password : 'API Key'
        }
    });

Alchemy.post = function(method, params, sysImports, next) {
  var args = {    
  };

  for (var k in params) {
    if (params.hasOwnProperty(k)) {
      args[k] = params[k];
    }
  }
  
  params.apikey = sysImports.auth.issuer_token.password;
  params.outputMode = 'json';
  
  request.post(
    'http://access.alchemyapi.com/calls/' + method,
    {
      form : params
    },
    function(err, res, body) {
      if (err) {
        next(err);
      } else {
        if ('ERROR' === body.status) {
          var msg = res.statusInfo;
          
          if (err.usage) {
            msg += ':' + err.usage;
          }
          
          next(msg);
        } else {
          next(false, body);
        }
      }
    }
  );
}

// Include any actions
Alchemy.add(require('./scrape_nlp_url.js'));
Alchemy.add(require('./scrape_nlp_html.js'));

// -----------------------------------------------------------------------------
module.exports = Alchemy;
