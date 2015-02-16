/**
 *
 * Reddit Pod for Bip.IO
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



var Pod = require('bip-pod'),
    Reddit = new Pod();


Reddit.getApiUrl = function() {

	var BASE_URL = 'http://www.reddit.com/api/';
	var API_VERSION = this.getSchema().version;
	var API_URL = BASE_URL + API_VERSION + '/';

	return API_URL;
}


// -----------------------------------------------------------------------------
module.exports = Reddit;
