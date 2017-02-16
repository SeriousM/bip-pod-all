/**
 *
 * Copyright (c) 2010-2014 WoT.IO inc http://wot.io
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
var gapi = require('googleapis'),
  gmail = gapi.gmail({ version : 'v1' });

function Send() {}

Send.prototype = {};

Send.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    auth = self.pod.getOAuthClient(sysImports),
    rawBody =
    'From:' + imports.user_id + '\r\n'
      + (imports.subject ? ('Subject:' + imports.subject + '\r\n') : '')
      + (imports.reply_to ? ('Reply-To:' + imports.reply_to + '\r\n') : '')
      + 'To:' + imports.rcpt_to + '\r\n'
      + "Content-Type: multipart/alternative; boundary=\"bipio_content_boundary\"\r\n\r\n"
      + "--bipio_content_boundary\r\n"
      + "Content-Type: text/html; charset=UTF-8\r\n\r\n"
      + imports.body.replace(/\n/g, '<br/>'),

    params = {
      auth : auth,
      userId:  'me',
      resource : {
        // google api uses url safe encoding (RFC 4648)
        raw : new Buffer(rawBody).toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '')
      }
    };

  gmail.users.messages.send(params, function(err, body, res) {
    next(err, body);
  });
}

// -----------------------------------------------------------------------------
module.exports = Send;