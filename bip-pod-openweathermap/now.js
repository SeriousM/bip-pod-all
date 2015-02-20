/**
 *
 * The Bipio OpenWeatherMap Pod.  
 * ---------------------------------------------------------------
 *
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
