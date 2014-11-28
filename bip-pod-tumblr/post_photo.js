/**
 *
 * The Bipio Tumblr Pod.
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
function PostPhoto() {}

PostPhoto.prototype = {};

/**
 * Invokes (runs) the action.
 *
 */
PostPhoto.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  if (contentParts._files) {
    for (var i = 0; i < contentParts._files.length; i++) {
      var localImports = app._.clone(imports);
      delete localImports.source;
      delete localImports.link;

      localImports.data = contentParts._files[i].localpath;
      this.pod._createPost('photo', localImports, channel, sysImports, contentParts, next);
    }
  } else {
    this.pod._createPost('photo', imports, channel, sysImports, contentParts, next);
  }
}
// -----------------------------------------------------------------------------
module.exports = PostPhoto;
