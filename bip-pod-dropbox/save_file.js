/**
 *
 * The Bipio Dropbox Pod.  save_file action definition
 * ---------------------------------------------------------------
 *  Any file generated by a Bip can be saved to a folder in your Dropbox account
 *  under the Bipio App folder
 * ---------------------------------------------------------------
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
function SaveFile() {}

SaveFile.prototype = {};

/**
 * Invokes (runs) the action.
 */
SaveFile.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    var exports = {}, numFiles = contentParts._files.length, dirPfx = '', self = this,
        $resource = this.$resource,
        log = this.$resource.log;

    if (imports.base_dir) {
        dirPfx += '/' + imports.base_dir
    }

    dirPfx += '/';

    if (contentParts._files && numFiles > 0) {
        var client = this.pod.getClient(sysImports);

        for (var i = 0; i < numFiles; i++) {
            file = contentParts._files[i];
            self.pod.limitRate(
                channel,
                (function(fileContext, self) {
                    return function() {
                        // search for file in remote, skip if exists
                        client.findByName(
                            dirPfx,
                            fileContext.name,
                            function(err, stats) {
                                if (err) {
                                    log(err, channel, 'error');
                                    next(err, {});

                                } else {
                                    var numFiles = stats.length, found = false;
                                    for (var i = 0; i <  numFiles; i++) {
                                        found = fileContext.name == stats[i].name;
                                        if (found) {
                                            next(err, stats[i]);
                                            break;
                                        }
                                    }

                                    // skip if found
                                    if (!found || $resource.helper.isTruthy(imports.overwrite)) {
                                        $resource.file.get(fileContext, function(err, fileStruct, readStream) {
                                            if (err) {
                                                next(err);
                                            } else {
                                                var buffers = [];
                                                readStream.on('data', function(chunk) {
                                                    buffers.push(chunk);
                                                });

                                                readStream.on('error', function(err) {
                                                    next(err);
                                                });

                                                fileStruct.pathed = dirPfx + fileContext.name;

                                                readStream.on('end', function() {
                                                    var b = Buffer.concat(buffers);
                                                    log('writing ' + b.length + ' bytes ' + fileStruct.pathed, channel, sysImports);
                                                    client.writeFile(fileStruct.pathed, b, function(error, stat)  {
                                                        if (error) {
                                                            log(error, channel, sysImports, 'error');
                                                        } else {
                                                            log('Wrote ' + stat.path, channel, sysImports);
                                                        }
                                                        next(error, stat);
                                                    });
                                                });
                                            }
                                        });
                                    }
                                }
                            }
                        );
                    }
                })(file, self)
            );
        }
    }
}

// -----------------------------------------------------------------------------
module.exports = SaveFile;