/**
 *
 * The Bipio Scriptr Pod.  runScript action definition
 * ---------------------------------------------------------------
 *  Runs a script
 * ---------------------------------------------------------------
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var request = require('request'),
  qs = require('querystring'),
  url = require('url'),
  path = require('path');

function OnRunScript() {}

OnRunScript.prototype = {};

OnRunScript.prototype.getAuth = function(user, bip, next) {
  var dao = this.$resource.dao;

  if (bip.config && bip.config.auth !== 'none') {
    if (bip.config.auth === 'token') {
      dao.find(
        'account_auth',
        {
          owner_id : user.id,
          type : 'token'
        },
        function(err, result) {
          if (err) {
            next(err);

          } else {
            var tokenAuth = dao.modelFactory('account_auth', result);
            next(false, user.username, tokenAuth.getPassword())
          }
      });
    } else {
      next(false, bip.config.username, bip.config.password);
    }

  } else {
    next();
  }
}

OnRunScript.prototype._buildWebhook = function(channel, accountInfo) {
	var self = this, options = {}, headers = {};
  	headers['Authorization'] = 'Bearer ' + accountInfo._setupAuth.oauth.access_token
  	headers['Content-Type'] = 'application/json';

	options.url = this.pod.getConfig()["api_base"] +  this.pod.getConfig()["management_path"] + "hooks";
	options.headers = headers;
	options.json = {
			"scriptName":  channel.config.script_name,
			"url": accountInfo.bip.repr(accountInfo)
	};
	return options;
}

OnRunScript.prototype._postToScriptr = function(options, accountInfo, next) {
	var self = this;
	self.getAuth(accountInfo.user, accountInfo.bip, function(err, username, password) {
		if (err) {
	      next(err);
	    } else {
	    	if(username && password) {
	    		options.json["hookToken"] = new Buffer(username + ':' + password).toString('base64');
	    	}
	        request(options, function(err, res, body) {
	            if (err) {
	                next(err);
	              } else {
	            	  if(body.response.metadata.statusCode != 200) {
	            		  next(body.response);
	            	  } else {
	            		  console.log("Scriptr Hook API Response for "+ options.method, JSON.stringify(body));//In case of success just logging the response
	            		  next();
	            	  }
	              }
	        });
	    }
	});
}

OnRunScript.prototype.setup = function(channel, accountInfo, next)  {
	var self = this, options = {};
	options = this._buildWebhook(channel, accountInfo);
	options.method = "POST";
	options.json.update = "false";
	self._postToScriptr(options, accountInfo, next);
	return;

}

OnRunScript.prototype.update = function(channel, accountInfo, next) {
	var self = this, options = {};
	options = this._buildWebhook(channel, accountInfo);
	options.method = "POST";
	if(accountInfo.previous_bip && (accountInfo.previous_bip.repr(accountInfo) != accountInfo.bip.repr(accountInfo)
		|| accountInfo.previous_bip && accountInfo.previous_bip.config["config"]["script_name"] != channel.config.script_name)) {
		options.json.update = "false";
		deleteOptions = {
			url: options.url,
			method: "DELETE",
			headers:  options.headers,
			json: {
				scriptName: accountInfo.previous_bip.config["config"]["script_name"],
				url : accountInfo.previous_bip.repr(accountInfo)
			}
		}
		request(deleteOptions, function(err, res, body) {
			 if (err) {
			        next(err);
			      } else {
			    	  if(body.response.metadata.statusCode != 200) {
	            		  next(body.response);
	            	  } else {
	            		  console.log("Scriptr Hook API Response for "+ deleteOptions.method, JSON.stringify(body));//In case of success just logging the response
	            		  next();
	            	  }
			    	  self._postToScriptr(options, accountInfo, next);
			      }
		    });
	} else {
		options.json.update = "true";
		self._postToScriptr(options, accountInfo, next);
	}
	return;
}

OnRunScript.prototype.teardown = function(channel, accountInfo, next) {
	var self = this, options = {};
	options = this._buildWebhook(channel, accountInfo);
	options.method = "DELETE";
    request(options, function(err, res, body) {
	    if (err) {
	        next(err)
	      } else {
	    	  if(body.response.metadata.statusCode != 200) {
        		  next(body.response);
        	  } else {
        		  console.log("Scriptr Hook API Response for "+options.method, JSON.stringify(body));//In case of success just logging the response
        		  next();
        	  }
	      }
    });
    return;
}


// -----------------------------------------------------------------------------
module.exports = OnRunScript;
