/**
 *
 * The Bipio Soundcloud Pod.  get_favorites action definition
 * ---------------------------------------------------------------
 *  Download Sounds I've Favorited
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2013 CloudSpark pty ltd http://www.cloudspark.com.au
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
var dbox = require('dropbox');

function GetFavorites(podConfig) {
    this.name = 'get_favorites';
    this.description = "Retrieve Sounds I've Favorited";
    this.trigger = true; 
    this.singleton = false;    
    this.podConfig = podConfig;
}

GetFavorites.prototype = {};

GetFavorites.prototype.getSchema = function() {
    return {
        'config' : {
            properties : {
                'download' : {
                    type : 'boolean',
                    description : "Download Files",
                    "default" : false
                }
            }
        },
        'exports' : {
            properties : {
                'title' : {
                    type : 'string',
                    description : 'Track Title'
                },
                'artist' : {
                    type : 'string',
                    description : 'Artist Name'
                },
                'genre' : {
                    type : 'string',
                    description : 'Music Genre'
                },
                'download_url' : {
                    type : 'string',
                    description : 'Direct Download URL'
                },
                'label_name' : {
                    type : 'string',
                    description : 'Releasing Label Name'
                },
                'permalink_url' : {
                    type : 'string',
                    description : 'Track Permalink URL'
                },
                'artwork_url' : {
                    type : 'string',
                    description : 'Track Artwork URL (JPEG)'
                },
                'description' : {
                    type : 'string',
                    description : 'Track Description'
                }
            }
        }
    }
}

/**
 * Invokes (runs) the action.
 */
GetFavorites.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    var uri = '/me/favorites', token = sysImports._oauth_token,
        resource = this.$resource;
        
    var dataDir = process.cwd() + resource.getDataDir(channel, 'get_favorites');

    resource._httpGet(uri + path + '.json?oauth_token=' + token, function(err, data) {
        var numTracks = 0, exports = {}, track, outfile, fName;
        
        if (!err) {
            numTracks = data.length;
            for (var i = 0; i < numTracks; i++) {
                track = data[i];         
                if (channel.config.download) {
                    if (track.downloadable) {
                        fName = track.title + '.mp3';
                        outfile = dataDir + fName;          
                        resource._httpStreamToFile(
                            track.download_url + '?oauth_token=' + token,
                            outfile,
                            function(err, exports, fileStruct) {
                                if (!err) {
                                    exports.artist = exports.user.username;
                                } else {
                                    resource.log(err, channel);
                                }
                                next(err, exports, { _files : [ fileStruct ]});
                            },
                            track,  // export
                            {       // file meta container
                                txId : sysImports.id,
                                localpath : outfile,
                                name : fName,
                                type : 'mp3',
                                encoding : 'binary'
                            }
                        );
                    } else {
                        resource.log(track.title + ' not downloadable', channel);
                    }
                } else {
                    next(false, track);
                }
            }
        } else {
            next(err, exports, []);
        }
    });
}

// -----------------------------------------------------------------------------
module.exports = GetFavorites;