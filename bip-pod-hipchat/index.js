/**
 *
 * The Bipio HipChat Pod.  HipChat Actions and Content Emitters
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
var Pod = require('bip-pod'),
Hipchatter = require('hipchatter'),
HipChat = new Pod();

HipChat.getClient = function(sysImports) {
  return new Hipchatter(sysImports.auth.issuer_token.password);
}

HipChat.rpc = function(action, method, sysImports, options, channel, req, res) {
  var self = this;
  if (method == 'room_list') {
    var client = self.getClient(sysImports);
    client.rooms(function(err, rooms) {
      if (err) {
        res.send(err)
      } else {
        res.send(rooms);
      }
    });

  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

// -----------------------------------------------------------------------------
module.exports = HipChat;
