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

weather.defaults =  {
    units:'metric', 
    lang:'en', 
    mode:'json'
}


function Now(podConfig) {
  this.name = 'now'; 
  this.title = 'The Current Weather';
  this.description = 'Current Weather for a Given City';
  this.trigger = false; 
  this.singleton = false; 
  this.auto = false; 
  this.podConfig = podConfig;
}

Now.prototype = {};

Now.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
      }
    },
    "imports": {
      "properties" : {
        "q" : {
          "type" : "string",
          "description" : "Name of City"
        }
      }
    },
    "exports": {
      "properties" : {
        "now" : {
          "type" : "object",
          "description" : "Current Weather"
        }
      }
    }
  }
}

Now.prototype.setup = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

Now.prototype.teardown = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}


Now.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    if (imports.q) {
        weather.now({q : imports.q}, function(err, cb) {
            if (err) {
              next(err);
            } else {
              next(false, cb);
            }
        }); 
    }
}

// -----------------------------------------------------------------------------
module.exports = Now;
