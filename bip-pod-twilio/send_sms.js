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
var to = require('twilio');

function SendSMS() {}

SendSMS.prototype = {};

/**
 * Invokes (runs) the action.
 */
SendSMS.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    // @todo via sysimports auth config
    // should be migrated into
    var client = new to.RestClient(
        sysImports.auth.issuer_token.username,
        sysImports.auth.issuer_token.password
    );

    client.sms.messages.create({
        to: imports.to_phone,
        from: imports.from_phone,
        body: imports.body
    }, function(error, message) {
        next(error, message);
    });

}

// -----------------------------------------------------------------------------
module.exports = SendSMS;