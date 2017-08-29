/**
 *
 * The Bipio Scriptr; Pod
 *
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
 *
 */
var Pod = require('bip-pod'),
  request = require('request'),
  querystring = require('query-string'),
  Scriptr = new Pod();

Scriptr.rpc = function(action, method, sysImports, options, channel, req, res) {
  var pod = this.pod;
  if (method == 'my_scripts') {

		var headers = {},
	  	url;

	  headers['Authorization'] = 'Bearer ' + sysImports.auth.oauth.access_token
	  headers['Content-Type'] = 'application/json';

	  url = this.getConfig()["api_base"] + this.getConfig()["management_path"] + 'scripts';

  	// cannot pipe, need to parse the response and re-case any error conditions
  	this._httpGet(
  		url,
  		function(err, body, resp, statusCode) {
  			if (err) {
  				res.status(500).end();
  			} else if (body && body.response.metadata.errorCode) {
  				if ('INVALID_TOKEN' === body.response.metadata.errorCode) {
						body.response.metadata.errorDetail = "\n Your Scriptr token has expired please re-authorize";
  				}
  				res.status(500).json({ message : body.response.metadata.errorCode + ' ' + body.response.metadata.errorDetail});
  			} else {
  				res.status(200).send(body);
  			}
  		},
  		headers
		);

  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

// -----------------------------------------------------------------------------
module.exports = Scriptr;