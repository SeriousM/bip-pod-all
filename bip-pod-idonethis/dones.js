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


function Dones(podConfig) {
	this.podConfig = podConfig; // general system level config for this pod (transports etc)
}


Dones.prototype = {};


Dones.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
	var self = this,
    	$resource = this.$resource;

	this.invoke(imports, channel, sysImports, contentParts, function(err, exports) {
    	if (err) {
    		next(err);
    	} else {
    		$resource.dupFilter(exports, 'id', channel, sysImports, function(err, done) {
				next(err, done);
			});
    	}
	});
}


Dones.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var url = this.pod.getApiUrl() + 'dones/?team=' + imports.team;

	if (imports.tags) {
		var tags = imports.tags.replace(/\s+/g,'');
		url = url + '&tags=' + tags;
	}

	this.$resource._httpGet(
		url,
		function(err, resp, headers, statusCode) {
			if (err) {
				next(err);
			} else {
				for (var i = 0; i < resp.results.length; i++) {
					next(false, resp.results[i])
				}
			}
		},
		{
			'Authorization' : 'TOKEN ' + sysImports.auth.issuer_token.username
		}
	);
}

// -----------------------------------------------------------------------------
module.exports = Dones;
