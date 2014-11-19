/**
 * 
 * openweathermap Actions and Content Emitters
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

var Pod = require('bip-pod'),
    openweathermap = new Pod({
        name : 'openweathermap', 
        title : 'OpenWeatherMap', 
        description : '<a href="http://openweathermap.org">OpenWeatherMap</a> service provides open weather data for more than 200,000 cities',
        authType : 'issuer_token',
        authMap : {
            username : 'OpenWeatherMap API Key'
        } 
    });

openweathermap.add(require('./forecast.js'));
openweathermap.add(require('./now.js'));
//openweathermap.add(require('./daily.js'));


// -----------------------------------------------------------------------------
module.exports = openweathermap;
