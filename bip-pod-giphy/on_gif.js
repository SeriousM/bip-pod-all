/**
 *
 * The Bipio Giphy Pod.  on_gif action definition
 * ----------------------------------------------------------------------
 *
 *  Copyright (c) 2015 Wot.IO
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

function OnGif() {
}

OnGif.prototype = {};

OnGif.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource;

  this.invoke(imports, channel, sysImports, contentParts, function(err, gif) {
    if (err) {
      next(err);
    } else {
      $resource.dupFilter(gif, 'id', channel, sysImports, function(err, gif) {
        next(err, gif);
      });
    }
  });
}


OnGif.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  this.$resource._httpGet(
    'http://api.giphy.com/v1/gifs/search?q= ' + encodeURIComponent(imports.q) + ' &api_key=' + sysImports.auth.issuer_token.key,
    function(err, resp) {
      if (err) {
        next(err);
      } else if (resp.data) {
        for (var i = 0; i < resp.data.length; i++) {
          next(false, resp.data[i]);
        }
      }
    }
  )
}

// -----------------------------------------------------------------------------
module.exports = OnGif;
