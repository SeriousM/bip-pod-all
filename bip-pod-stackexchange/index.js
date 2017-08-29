/**
 *
 * StackExchange Pod for Bip.IO
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
 *
 */



var Pod = require('bip-pod'),
    StackExchange = new Pod();

StackExchange.rpc = function(action, method, sysImports, options, channel, req, res) {
  if (method == 'get_sites') {
  	this.$resource._httpGet("https://api.stackexchange.com/2.2/sites", function(err, body, headers, statusCode) {
      res.status(statusCode).send(body);
  	});
  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

// -----------------------------------------------------------------------------
module.exports = StackExchange;
