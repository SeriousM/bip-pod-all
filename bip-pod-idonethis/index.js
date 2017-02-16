/**
 *
 * Idonethis Pod for Bip.IO
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
    Idonethis = new Pod();

Idonethis.testCredentials = function(struct, next) {

	var url = this.getApiUrl() + 'noop';

	this.$resource._httpGet(
		url,
		function(err, resp, headers, statusCode) {
			if (err) {
				next(err, 500);
			} else if (statusCode == 200) {
				next(false, 200);
			} else if (statusCode !== 200) {
				next( (resp && resp.detail) ? resp.detail : 'Invalid Token');
			}
		},
		{
			'Authorization' : 'TOKEN ' + struct.username
		}
	);
}


// TODO pass sysImports as param in order to inject auth header.
// TODO wrap _httpGet fn call as base level API getter.
Idonethis.getApiUrl = function() {

	var BASE_URL = 'https://idonethis.com/api/';
	var API_VERSION = this.getSchema().version;
	var API_URL = BASE_URL + API_VERSION + '/';

	return API_URL;
}


Idonethis.rpc = function(action, method, sysImports, options, channel, req, res) {
	if (method == 'teams') {
		var url = this.getApiUrl() + 'teams/';
	 	this.$resource._httpGet(
			url,
			function(err, resp, headers, statusCode) {
				res.contentType(pod.getRPCs('teams').contentType);
				res.status(err? 500 : 200).send(resp);
			},
			{
				'Authorization' : 'TOKEN ' + sysImports.auth.issuer_token.username
			}
		);

	} else {
    	this.__proto__.rpc.apply(this, arguments);
	}
}

// -----------------------------------------------------------------------------
module.exports = Idonethis;
