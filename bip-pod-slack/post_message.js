/**
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
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
var util = require('util');

function PostMessage(podConfig) {
}

PostMessage.prototype = {};

PostMessage.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

  var params = JSON.parse(JSON.stringify(imports));
  params.channel = imports.channel;
  if (imports.username) {
    params.username = imports.username;
  }

  this.pod.slackRequestParsed('chat.postMessage', params, sysImports, next);
}

// -----------------------------------------------------------------------------
module.exports = PostMessage;