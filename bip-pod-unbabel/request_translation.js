/**
 *
 * The Bipio Unbabel Pod
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

function RequestTranslation() {
}

RequestTranslation.prototype = {};

// RPC/Renderer accessor - /rpc/render/channel/{channel id}/hello
RequestTranslation.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  var self = this;
  if (method === 'update_status') {
    res.contentType(self.pod.getActionRPC(self.name, method).contentType);
    res.send('world');
  } else {
    res.send(404);
  }
}

RequestTranslation.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var modelName = this.$resource.getDataSourceName('track_translation'),
    pod = this.pod,
    payload = imports;
    payload.target_language = imports.target_language;

  pod.requestPOST('translation', payload, sysImports, function(err, response) {
    if (!err) {
      response.price_eur = response.price;
    }
    next(err, response);
  });

}

// -----------------------------------------------------------------------------
module.exports = RequestTranslation;