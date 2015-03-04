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

var MongoClient = require('mongodb').MongoClient;

var Pod = require('bip-pod'),
    mongodb = new Pod();

mongodb.testCredentials = function(struct, next) {
    var url = struct.username,
        config = this.getConfig();

    // host blacklisted ?
    this.$resource._isVisibleHost.call(this, url, function(err, blacklisted) {
        if (err) {
            next(err, 500);

        } else if (blacklisted.length !== 0) {
            next("Not Authorized", 401);

        } else {
            // assumes previously non-Authed url has been set.
            // var authedUrl = url.substr(0, 10)  + creds.username + ':' + creds.password + '@'  + url.substr(10);
            MongoClient.connect(url, { uri_decode_auth : true }, function(err, db) {
              if ( err === null ) {
                next();
              } else if (err.match(/authenticate/g).length) {
                next("Not Authorized", 401);
              } else if (err.match(/connection/g).length) {
                next("Not Found", 404);
              } else {
                next("DNS Failure", 502);
              }
            });
        }
    }, null, config.whitelist);
}

var channelKeepAlive = 10000,
    clientConnections = {
    _channels : {},
    dropConnection : function(key) {
        if (clientConnections._channels[key]) {
            clientConnections._channels[key].connection.close();
            delete clientConnections._channels[key].connection;
        }
    },
    resetTimer : function(key) {
        var self = clientConnections._channels[key];

        if (self) {
            if (self.timer) {
                clearTimeout(self.timer);
                self.timer = null;
            }

            self.timer = setTimeout(function() {
                clientConnections.dropConnection(self.key);
            }, channelKeepAlive);
        }
    },
    getConnection : function(key, next) {
        var channels = clientConnections._channels;

        if (channels[key] && channels[key].connection) {
            next(false, channels[key].connection);
        } else {
            var options = {
                    socketOptions : {
                        keepAlive : 1
                    },
                    auto_reconnect : true
                };

            MongoClient.connect(key, options, function(err, db) {
                if (err) {
                    next(err);
                } else {
                    clientConnections._channels[key] = {
                        key : key,
                        connection : db
                    };

                    clientConnections.resetTimer(key);

                    next(false, db);
                }
            });
        }
    }
};


mongodb.getClient = function(sysImports, next) {
    clientConnections.getConnection(sysImports.auth.issuer_token.username, next);
}

// -----------------------------------------------------------------------------
module.exports = mongodb;
