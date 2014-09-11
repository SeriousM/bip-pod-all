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

function ScreenShot(podConfig) {
  this.name = 'screen_shot'; // action name (channel action suffix - "action: boilerplate.simple")
  this.title = 'Screen Shot a Web Page', // short description
  this.description = 'Takes a screen shot of a given URL in a browser', // long description
  this.trigger = false; // this action can trigger
  this.singleton = false; // 1 instance per account (can auto install)
  this.auto = false; // automatically install this action
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

ScreenShot.prototype = {};

// ScreenShot schema definition
// @see http://json-schema.org/
ScreenShot.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "viewport" : {
          "type" :  "string",
          "description" : "Viewport size pixels, eg 800x1128"
        }
      }
    },
    "imports": {
      "properties" : {
        "url" : {
          "type" :  "string",
          "description" : "Target URL"
        },
        "viewport" : {
          "type" :  "string",
          "description" : "Viewport size pixels, eg 800x1128"
        }
      },
      "required" : [ "url" ]
    }
  }
}

ScreenShot.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod;

  if (imports.url) {
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
          fs.stat(outPath, function(err, stats) {
            if (err) {
              next(err);
            } else {
              var fStruct = {
                txId : sysImports.id,
                localpath : outPath,
                name : fileName,
                type : 'image/png',
                encoding : 'binary',
                size : stats.size
              }

              if (contentParts && contentParts._files) {
                contentParts._files.push(fStruct)
              } else {
                contentParts = {
                  _files : [ fStruct ]
                }
              }

              next(err, {}, contentParts, fStruct.size);
            }
          });
        }
      });
    });
  } else {
    next();
  }
}

// -----------------------------------------------------------------------------
module.exports = ScreenShot;