/**
 *
 * The Bipio OpenWeatherMap Pod.  
 * ---------------------------------------------------------------
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

var weather = require('openweathermap');


function Now(podConfig) {
  this.podConfig = podConfig; 
}


Now.prototype = {};


Now.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

	var reqParams = {}, weatherNow = {};

	if (imports.q) {
		reqParams = this.pod.getDefaults();
		reqParams['q'] = imports.q;
		
		weather.now(reqParams, function(data) {
			if (data) {
				weatherNow.temp = data['main'].temp;
				weatherNow.description = data['weather'][0].description;
				weatherNow.wind_speed = data['wind'].speed;
				weatherNow.wind_direction = data['wind'].deg;
				next(false, weatherNow);
			}	
		}); 
	}
}

// -----------------------------------------------------------------------------
module.exports = Now;
