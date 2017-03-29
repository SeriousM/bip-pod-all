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

var WeMo = new require('wemo')

function Motion_detection(podConfig) {
}

Motion_detection.prototype = {};

Motion_detection.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

	var wemoMotion = new WeMo(imports.device_ip, imports.device_port);

	wemoMotion.state = 0;

	setTimeout(function() {
		wemoMotion.getBinaryState(function(err, result) {
			if (err){
				next(err)
			}
			switch (parseInt(result) - wemoMotion.state) {
				// movement
				case 1  :
					next(false, { 'movement' : true } );
		    	break;

		    // no change
				case 0  :
          break;

        // movement stopped
				case -1 :
					next(false, { movement : false })
					break;

				default :
					next('Unexpected Movement Value');
					break;
			}
		});
	}, 1000);

}

// -----------------------------------------------------------------------------
module.exports = Motion_detection;
