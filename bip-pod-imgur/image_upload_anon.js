/**
 *
 * The Bipio Twilio Pod.  send_sms action definition
 * ---------------------------------------------------------------
 *  Sends a new outgoing SMS Message. If you are sending SMS while your Twilio
 *  account is in Trial mode, the "To" phone number must be verified with Twilio.
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
var request = require('request'),
    fs = require('fs'),
    https = require('https');

function ImageUploadAnon(podConfig) {
    this.name = 'image_upload_anon';
    this.description = 'Anon Image Upload',
    this.description_long = 'Upload an image to Imgur Anonymously (meaning, not tied to your account)',
    this.trigger = false;
    this.singleton = false;
    this.auto = true; // can auto-install with empty config
    this.podConfig = podConfig;
}

ImageUploadAnon.prototype = {};

ImageUploadAnon.prototype.getSchema = function() {
    return {        
        'exports' : {
            properties : {
                'id' : {
                    type : 'string',
                    description : 'Image ID'
                },
                'deletehash' : {
                    type : 'string',
                    description : 'Unique Deletion Hash'
                },
                'link' : {
                    type : 'string',
                    description : 'Link to Image'
                }
            }
        },
        "imports": {        
            properties : {
                "title" : {
                    type : "string",
                    description : "Image Title"
                },
                "description" : {
                    type : "string",
                    description : "Image Description"
                }
            }
        }
    }
}

/**
 * Invokes (runs) the action.
 */
ImageUploadAnon.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    var log = this.$resource.log, exports = {},  numFiles = contentParts._files.length, dirPfx = '';

    if (contentParts._files && numFiles > 0) {
        for (var i = 0; i < numFiles; i++) {
            if (/(png|jpg|gif|jpeg|apng|tiff|bmp|pdf|xcf)$/gi.test(contentParts._files[i].type)) {
                var options = {
                    url: 'https://api.imgur.com/3/upload',
                    headers: {
                        'Authorization': 'Client-ID ' + this.podConfig.issuer_token.username
                    }
                };

                var post = request.post(options, function(err, req, body){
                    try{
                        next(err, JSON.parse(body).data);
                    } catch(e){
                        log(body, channel, 'error');
                        next(err, body);
                    }
                });

                var upload = post.form();
                upload.append('type', 'file');
                upload.append('image', fs.createReadStream(contentParts._files[i].localpath));
            }
        }
    } else {
        // silent passthrough
        next(false, exports);    
    }    
}

// -----------------------------------------------------------------------------
module.exports = ImageUploadAnon;