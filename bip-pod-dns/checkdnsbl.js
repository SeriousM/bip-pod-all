/**
 *
 * @author wot.io devs <dev@wot.io>
 * Copyright (c) 2015 wot.io http://wot.io
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


var dns = require('dns'),
	rbls = require('./rbls.json');


function CheckDNSBL() {}

CheckDNSBL.prototype = {};


CheckDNSBL.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	var reversed = imports.ip.split('.').reverse().join('.');
	var found = false;
	var results = []; 

	rbls.map(blacklisted);

	function blacklisted(rbl) {
		dns.resolve4(reversed + rbl.dns, function (err, domain) {
			results.push(err ? false : true);
			if (results.length === rbls.length) { 
				found = results.filter(function(el) { return el; }) 
				found = found.length ? true : false;
				next(err, found);
			}
		}); 
	}
}



