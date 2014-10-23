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
    mongodb = new Pod({
        name : 'mongodb', // pod name (action prefix)
        title : 'MongoDB', // short description
        description : '<a href="http://www.mongodb.org" target="_blank">MongoDB</a> (from "humongous") is an open-source document database, and the leading NoSQL database.',
        authType : 'issuer_token',
        authMap : {
            username : 'MongoDB Connection URI'
        }
    });


/*
mongodb.hostCheck = function(sysImports.auth.issuer_token.username, channel, next) {
  this.$resource._isVisibleHost(sysImports.auth.issuer_token.username, function(err, blacklisted) {
    next(err, blacklisted.length !== 0);
  }, channel, this.podConfig.whitelist);
}

mongodb.checkHost = function() {
    if (sysImports.auth.issuer_token.username) {
        this.hostCheck(url, channel, function(err, blacklisted) {
        if (err) {
            next('Server Error',500);
        } else if (blacklisted) {
            next('Requested host [' + url + '] is blacklisted', 403);
        } else if (!url) {
            next('Host Not Found',404);
        } else {
            next();
        }
        }
    } 
}
*/

mongodb.testCredentials = function(creds, next) {
    var url = sysImports.auth.issuer_token.username;
    // assumes previously non-Authed url has been set.
    var authedUrl = url.substr(0, 10)  + creds.username + ':' + creds.password + '@'  + url.substr(10);
    MongoClient.connect(authedUrl,{ uri_decode_auth = true; }function(err, db) {
      console.log(arguments);
      if ( err === null ) {
        next();
      } else if (err.match(/authenticate/g).length) {
        next("Unauthorized", 401);
      } else if (err.match(/connection/g).length) {
        next("Not Found",404);
      } else {
        next("DNS Failure",502); // that or its a replicaset failure.
      }
    });
}


mongodb.getClient = function(connectionString, connection) {

    var channelKeepAlive = 6000;
    var options = {};

    options.socketOptions = { keepAlive: 1 };
    options.auto_reconnect = true;

    var clientConnections = {
    _connection : {},
    dropConnection : function() {
        if (clientConnections._connection) {
        clientConnections._connection.close();
        delete clientConnections._connection;
        }
    },
    resetTimer : function(_connection) {
        var self = clientConnections._connection;

        if (self) {
        if (self.timer) {
            clearTimeout(self.timer);
            self.timer = null;
        }

        self.timer = setTimeout(function() {
            connections.dropConnection(self._connection);
        }, channelKeepAlive);
        }
    },
    getConnection : function() {
        if (clientConnections._connection) {
            return _connection;
        } else {
            MongoClient.connect(connectionString, options, function(err, db) {
                assert.equal(null, err);
                console.log('Connected correctly to server');
                clientConnections.resetTimer(this._connection);
                clientConnections._connection = db;
            });
        } 
    }
    }

}

// Include any actions
mongodb.add(require('./insert.js'));
mongodb.add(require('./find.js'));
mongodb.add(require('./update.js'));
mongodb.add(require('./remove.js'));
// -----------------------------------------------------------------------------
module.exports = mongodb;
