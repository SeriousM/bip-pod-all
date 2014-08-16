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

function SendSMS(podConfig) {
    this.name = 'send_sms';
    this.description = 'Send an SMS message',
    this.description_long = 'Sends a new outgoing SMS Message. If you are sending SMS while your Twilio account is in Trial mode, the "To" phone number must be verified with Twilio.',    
    this.trigger = false; 
    this.singleton = false;    
    this.podConfig = podConfig;
}

SendSMS.prototype = {};

SendSMS.prototype.getSchema = function() {
    return {
        'config' : { // config schema
            properties : {
                'body' : {
                    type : 'string',
                    description : 'Default SMS Body'
                },
                'to_phone' : {
                    type : 'string',
                    description : 'Default destination phone #'
                },
                'from_phone' : {
                    type : 'string',
                    description : 'From Phone Number',
                    required : true
                }
            }
        },
        'exports' : {        
            properties : {
                'status' : {
                    type : 'string',
                    description : 'SMS Status'
                },
                'sid' : {
                    type : 'string',
                    description : 'SMS Message Id'
                },
                'body' : {
                    type : 'string',
                    description : 'SMS Message Body or Error Response Body'
                },
                'uri' : {
                    type : 'string',
                    description : 'Twilio SMS URI'
                }
            }
        },
        // todo validator 160 chars max
        "imports": {        
            properties : {            
                'body' : {
                    type : 'string',
                    description : 'SMS Body.  Uses channel default if empty'
                },
                'to_phone' : {
                    type : 'string',
                    description : 'Recipient Phone #.  Uses channel default if empty'
                }
            }
        }
    }
}

/**
 * Invokes (runs) the action.
 */
SendSMS.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    var $resource = this.$resource,
        self = this,
        log = $resource.log,
        exports = {}, 
        to_phone, 
        body;
    
    // @todo via sysimports auth config
    // should be migrated into
    var client = new to.RestClient(
        sysImports.auth.issuer_token.username, 
        sysImports.auth.issuer_token.password
    );
   
    if (imports.to_phone && '' !== imports.to_phone) {
        to_phone = imports.to_phone;
    } else {
        to_phone = channel.config.to_phone;
    }
   
    if (imports.body && '' !== imports.body) {
        body = imports.body;
    } else {
        body = channel.config.body;
    }
    
    if (body && '' !== body && to_phone && '' !== to_phone) {
        client.sms.messages.create({
            to:to_phone,
            from: channel.config.from_phone,
            body: body
        }, function(error, message) {                       
            if (error) {
                log(error, channel, 'error');
            } else {
                exports.sid = message.sid;
                exports.body = message.body;
                exports.status = message.status;
                exports.uri = message.uri;

                next(error, exports);
            }
        });
    } else {
        next(false, exports);
    } 
}

// -----------------------------------------------------------------------------
module.exports = SendSMS;