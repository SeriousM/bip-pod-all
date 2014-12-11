/**
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

var webshot = require('webshot'),
  crypto = require('crypto'),
  path = require('path'),
  fs = require('fs');

function ScreenShot(podConfig) {}

ScreenShot.prototype = {};

ScreenShot.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod;

  pod.getDataDir(channel, this.name, function(err, dataDir) {
    var md5Hash = crypto.createHash('md5').update(imports.url).digest('hex'),
      options = {};

    if (channel.config && channel.config.viewport) {
      var tokens = channel.config.viewport.split('x');
      md5Hash += channel.config.viewport.replace(/[^x0-9]/g, '');
      if (tokens.length === 2) {
        options.screenSize = {
          width : Number(tokens[0].trim()),
          height : Number(tokens[1].trim()),
        };

        options.shotSize = {
          width : options.screenSize.width,
          height : 'all'
        }
      }
    }

    var fileName = md5Hash + '.png',
      outPath = path.normalize(dataDir + fileName);

    webshot(imports.url, outPath, options, function(err) {
      if (err) {
        next(err);
      } else {
        $resource.file.find(outPath, function(err, file) {
          if (err) {
            next(err);
          } else {

            if (contentParts && contentParts._files) {
              contentParts._files.push(file)
            } else {
              contentParts = {
                _files : [ file ]
              }
            }

            next(err, {}, contentParts, file.size);
          }
        });
      }
    });
  });
}

// -----------------------------------------------------------------------------
module.exports = ScreenShot;