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
mongodb.hostCheck = function(host, channel, next) {
  this.$resource._isVisibleHost(host, function(err, blacklisted) {
    next(err, blacklisted.length !== 0);
  }, channel, this.podConfig.whitelist);
}


var struct = {
          owner_id : accountId,
          username : req.query.username,
          key : req.query.key,
          password : req.query.password,
          type : this._authType,
          auth_provider : podName
        };
*/

mongodb.testCredentials = function(struct, next) {
    MongoClient.connect(struct.username, function(err, db) {
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

// Include any actions
mongodb.add(require('./create.js'));
mongodb.add(require('./find.js'));
mongodb.add(require('./update.js'));
mongodb.add(require('./delete.js'));
// -----------------------------------------------------------------------------
module.exports = mongodb;
