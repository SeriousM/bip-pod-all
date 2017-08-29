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


var dns = require('dns'),
	rbls = require('./rbls.json');


function CheckDNSBL() {}

CheckDNSBL.prototype = {};

CheckDNSBL.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	var reversed = imports.ip.split('.').reverse().join('.').replace(/\"/,'');
	var found = false;
	var result;
	var results = [];

	rbls.map(blacklisted);

	function blacklisted(rbl) {
		dns.resolve4(reversed + '.' + rbl.dns, function (err, domain) {
			results.push(err ? false : true);
			if (results.length === rbls.length) {
				found = results.filter(function(el) { return el; })
				result = found.length ? true : false;
				next(false, {blacklisted : result });
			}
		});
	}
}

module.exports = CheckDNSBL;



