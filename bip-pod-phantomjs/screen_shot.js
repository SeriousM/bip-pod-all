/**
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var webshot = require('webshot'),
  crypto = require('crypto'),
  path = require('path'),
  fs = require('fs');

function ScreenShot(podConfig) {}

ScreenShot.prototype = {};

ScreenShot.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod,
    cdn = this.$resource.file,
    dataDir = this.pod.getDataDir(channel, this.name),
    md5Hash = crypto.createHash('md5').update(imports.url).digest('hex'),
    options = {};

  if (imports && imports.viewport) {
    var tokens = imports.viewport.split('x');
    md5Hash += imports.viewport.replace(/[^x0-9]/g, '');
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

  // touch cdn local file
  cdn.save(outPath, new Buffer(''), function(err, struct) {
    if (err) {
      next(err);
    } else {
      webshot(imports.url, struct.localpath, options, function(err) {
        if (err) {
          next(err);
        } else {
          cdn.find(struct, function(err, file) {
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
    }
  });



}

// -----------------------------------------------------------------------------
module.exports = ScreenShot;