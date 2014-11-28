/**
 *
 * The Bipio Embedly Pod
 * ---------------------------------------------------------------
 *
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

function OEmbed() {}

OEmbed.prototype = {};

/**
 * Invokes (runs) the action.
 */
OEmbed.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var log = this.$resource.log,
    pod = this.pod;

  pod.api(channel, sysImports, function(err, api) {
    if (err) {
      next(err);
    } else {
      var opts = {
        url : imports.url ,
        format : 'json'
      };

      pod._testAndSet(imports, opts, 'maxwidth');
      pod._testAndSet(imports, opts, 'maxheight');
      pod._testAndSet(imports, opts, 'autoplay');
      pod._testAndSet(imports, opts, 'words');

      api.oembed(opts, function(err, obj) {
        if (err) {
          log(err, channel, 'error');
        } else {
          for (var i = 0; i < obj.length; i++) {
            next(false, obj[i], contentParts, 0);
          }
        }
      }
      );
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = OEmbed;