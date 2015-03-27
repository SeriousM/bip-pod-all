/**
 *
 * Copyright (c) 2010-2014 WoT.IO inc http://wot.io
 * @author Michael Pearson <michael@wot.io>
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
var gapi = require('googleapis'),
  gmail = gapi.gmail({ version : 'v1' });

function OnNewMessage() {}

OnNewMessage.prototype = {};

OnNewMessage.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
	imports.searchQuery="newer_than:1d";
	this.pod._parseEmails(gmail, imports, channel, sysImports, contentParts, next, false);
}
 
OnNewMessage.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	imports.searchQuery="newer_than:1d";
	this.pod._invoker(gmail,imports, channel, sysImports, contentParts, next);
}
// -----------------------------------------------------------------------------
module.exports = OnNewMessage;