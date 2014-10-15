/**
 * 
 * mongodb Actions and Content Emitters
 * 
 * @author Scott Tuddenham <scott@bip.io>
 * Copyright (c) 2014 WoT.IO http://wot.io
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
var Pod = require('bip-pod'),
    mongodb = new Pod({
        name : 'mongodb', // pod name (action prefix)
        title : 'mongodb', // short description
        description : 'A pod to connect with a mongodb datastore'
        authType : 'issuer_token',
        authMap : {
            username : 'MONGODB_CONNECTION_STRING_GOES_HERE',
        },
        'renderers' : {
            'test_connection' : {
                description : 'test connection to MongoDB datastore',
                contentType : DEFS.CONTENTTYPE_JSON
            }
        }
    
    });

// Include any actions
mongodb.add(require('./crud.js'));

// -----------------------------------------------------------------------------
module.exports = mongodb;
