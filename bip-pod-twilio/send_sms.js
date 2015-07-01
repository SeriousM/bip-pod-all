/**
 *
 * The Bipio Twilio Pod.  send_sms action definition
 * ---------------------------------------------------------------
 *  Sends a new outgoing SMS Message. If you are sending SMS while your Twilio
 *  account is in Trial mode, the "To" phone number must be verified with Twilio.
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2013 Michael Pearson https://github.com/mjpearson
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