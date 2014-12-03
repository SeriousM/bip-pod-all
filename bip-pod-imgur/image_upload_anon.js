/**
 *
 * The Bipio Twilio Pod.  send_sms action definition
 * ---------------------------------------------------------------
 *  Sends a new outgoing SMS Message. If you are sending SMS while your Twilio
 *  account is in Trial mode, the "To" phone number must be verified with Twilio.
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
var request = require('request'),
    https = require('https');

function ImageUploadAnon() {}

ImageUploadAnon.prototype = {};

/**
 * Invokes (runs) the action.
 */
ImageUploadAnon.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    var log = this.$resource.log,
        self = this,
        exports = {},
        numFiles = contentParts._files.length, dirPfx = '',
        $resource = this.$resource,
        clientID = sysImports.auth.oauth.clientID;

    if (contentParts._files && numFiles > 0) {
        for (var i = 0; i < numFiles; i++) {
            if (/(png|jpg|gif|jpeg|apng|tiff|bmp|pdf|xcf)$/gi.test(contentParts._files[i].type)) {
                $resource.file.get(contentParts._files[i], function(err, fileStruct, stream) {
                    if (err) {
                        next(err);
                    } else {
                        var options = {
                            url: 'https://api.imgur.com/3/upload',
                            headers: {
                                'Authorization': 'Client-ID ' + clientID
                            }
                        };

                        var post = request.post(options, function(err, req, body){
                            try{
                                next(err, JSON.parse(body).data, contentParts, fileStruct.size);
                            } catch(e){
                                log(body, channel, 'error');
                                next(err, body);
                            }
                        });

                        var upload = post.form();
                        upload.append('type', 'file');
                        upload.append('image', stream);
                    }
                });
            } else {
                next(false, exports);
            }
        }
    } else {
        // silent passthrough
        next(false, exports);
    }
}

// -----------------------------------------------------------------------------
module.exports = ImageUploadAnon;