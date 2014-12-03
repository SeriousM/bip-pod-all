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

function Upload() {}

Upload.prototype = {};

Upload.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var client, pod = this.pod, f, transferredBytes = 0;

  if (contentParts._files && contentParts._files.length) {
    client = pod._getClient(sysImports);

    for (var i = 0; i < contentParts._files.length; i++) {
      f = contentParts._files[i];

      this.$resource.file.get(contentParts._files[i], function(err, fileStruct, readStream) {
        if (err) {
          next(err);
        } else {
          if ('application/octet-stream' === f.type) {
            transferredBytes += f.size;
            client.streamingUpload(fileStruct.localpath, function(err) {
              if (err) {
                next(err);
              } else {
                next(false, { status : true }, contentParts, transferredBytes);
              }
            });
          }
        }
      });
    }
  }

}

// -----------------------------------------------------------------------------
module.exports = Upload;