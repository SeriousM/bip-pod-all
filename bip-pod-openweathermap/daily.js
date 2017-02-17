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


function Daily(podConfig) {
  this.podConfig = podConfig;
}


Daily.prototype = {};


Daily.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

	var reqParams = {};

	if (imports.q) {
		reqParams = this.pod.getDefaults();
		reqParams['q'] = imports.q;
		reqParams['cnt'] = imports.cnt ? imports.cnt : 5;
		
		weather.daily(reqParams, function(data) {
			if (data) {
				data.list.forEach( function(day) {
					weatherObj.temp_day = day.temp.day;
					weatherObj.temp_night = day.temp.night;
					weatherObj.description = day['weather'][0].description;
					weatherObj.wind_speed = day.speed;
					weatherObj.wind_direction = day.deg;
					weatherObj.pressure = day.pressure;
					weatherObj.humidity = day.humidity;
					next(false, weatherObj);
				});
			}	
		}); 
	}
}




// -----------------------------------------------------------------------------
module.exports = Daily;
