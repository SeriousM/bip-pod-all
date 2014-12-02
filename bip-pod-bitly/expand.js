/**
 *
 * The Bipio Bitly Pod
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2013 Michael Pearson https://github.com/mjpearson
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

function Expand() {}

Expand.prototype = {};

Expand.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var uri = 'https://api-ssl.bitly.com/v3/shorten/longUrl?url=';
  uri += imports.short_url + '&access_token=' + sysImports.auth.oauth.access_token;
  pod._httpGet(uri, function(err, bodyJSON) {
    next(err || bodyJSON.status_code !== 200, bodyJSON.data, contentParts, 0);
  });
}

// -----------------------------------------------------------------------------
module.exports = Expand;