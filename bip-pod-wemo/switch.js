/**
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

// @see https://developer.nest.com/documentation/api-reference

var WeMo = new require('wemo')

function Switch(podConfig) {
}

Switch.prototype = {};

Switch.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

	var state = imports.state;

	var wemoSwitch = new WeMo(imports.device_ip, imports.device_port);
	wemoSwitch.setBinaryState(state, function(err, result) {
		if (err) {
			next(err)
		} else {
			next(false,{});
		}
	});
}

module.exports = Switch;
