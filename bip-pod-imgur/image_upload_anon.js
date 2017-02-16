/**
 *
 * The Bipio Twilio Pod.  send_sms action definition
 * ---------------------------------------------------------------
 *  Sends a new outgoing SMS Message. If you are sending SMS while your Twilio
 *  account is in Trial mode, the "To" phone number must be verified with Twilio.
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