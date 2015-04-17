/**
 *
 * @author wot.io Devs <devs@wot.io>
 * Copyright (c) 2015 wot.io 
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

function AddEvents() {}

AddEvents.prototype = {};

AddEvents.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var client = this.pod.getClient(sysImports, channel.config.project_id);
  try {
    var evsData = this.$resource.helper.isObject(imports.events) ? imports.events : JSON.parse(imports.events);
    client.addEvents(evsData, function(err, res) {
      if (err) {
	    next(err);
	  } else {
		
		Object.keys(res).forEach(function(collection) {
			res[collection].forEach(function(succeeded) {
				next(false, succeeded);
			}); 
		});

	  }
    });
  } catch (e) {
    next(e);
  }
}

// -----------------------------------------------------------------------------
module.exports = AddEvents;
