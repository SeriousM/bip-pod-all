/**
 *
 * The Bipio Forecast Pod.  openweathermap sample action definition
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

var weather = require 'openweathermap';

weather.defaults =  {
    units:'metric', 
    lang:'en', 
    mode:'json'
}


function Forecast(podConfig) {
  this.name = 'forecast'; 
  this.title = 'Forecast';
  this.description = 'Forecast for a Given City';
  this.trigger = false; // this action can trigger
  this.singleton = false; // 1 instance per account (can auto install)
  this.auto = false; // automatically install this action
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Forecast.prototype = {};

Forecast.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
      }
    },
    "imports": {
      "properties" : {
        "id" : {
          "type" :  "string",
          "description" : "ID for City"
        }
      }
    },
    "exports": {
      "properties" : {
        "forecast" : {
          "type" : "object",
          "description" : "Forecast"
        }
      }
    }
  }
}

Forecast.prototype.setup = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

Forecast.prototype.teardown = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

/**
 * Action Invoker - the primary function of a channel
 * 
 * e.g. New York City's id is 5128581
 */
 
Forecast.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    if (imports.id) {
        weather.forecast({id : imports.id}); 
    }
}

// -----------------------------------------------------------------------------
module.exports = Forecast;
