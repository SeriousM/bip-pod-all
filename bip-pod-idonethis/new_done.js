/**
 *
 * The Bipio Idonethis Pod.  dones action definition
 * ----------------------------------------------------------------------
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


function NewDone(podConfig) {
	this.podConfig = podConfig;
}


NewDone.prototype = {};


NewDone.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

	var done = {
		"raw_text": imports.raw_text,
		"team": imports.team
	}

    var url = this.pod.getApiUrl()  + 'dones/';
	this.$resource._httpPost(
		url,
		done,
		function(err,  body) {
			if (body.errors) {
				next(body.message)
			} else {
				next(err, body);
			}
		},
		{
    		'Authorization' : 'TOKEN ' + sysImports.auth.issuer_token.username
		}
	);
}

// -----------------------------------------------------------------------------
module.exports = NewDone;
