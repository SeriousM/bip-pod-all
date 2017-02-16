/**
 *
 * The Bipio Idonethis Pod.  dones action definition
 * ----------------------------------------------------------------------
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


function NewDone(podConfig) {
	this.podConfig = podConfig;
}


NewDone.prototype = {};


NewDone.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

	var done = {
		"raw_text": imports.raw_text,
		"team": imports.team
	}

    var url = this.pod.getApiUrl()  + 'dones/';
	this.$resource._httpPost(
		url,
		done,
		function(err,  body) {
			if (body.errors) {
				next(body.message)
			} else {
				next(err, body);
			}
		},
		{
    		'Authorization' : 'TOKEN ' + sysImports.auth.issuer_token.username
		}
	);
}

// -----------------------------------------------------------------------------
module.exports = NewDone;
