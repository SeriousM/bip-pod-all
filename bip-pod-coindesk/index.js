/**
 *
 * CoinDesk Actions and Content Emitters
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
    CoinDesk = new Pod({},
      function() {
      	var self = this;
      	// refresh prices every 60 seconds
      	setInterval(function() {
      		self.refreshPrice.call(self);
      	}, 60000);
    });

var lastPrice,
	lastPriceUSD,
	lastTime,
	url = "http://api.coindesk.com/v1/bpi/currentprice.json",
	channelInfo = {
    action : 'CoinDesk:constructor',
    owner_id : 'system'
  };

CoinDesk._setLastPrice = function(err, respBody) {
	var self = this;

	if (err) {
		this.log(err, channelInfo, 'error');
	} else {
		// (note) coindesk uses 'application/javascript' content-type to serve json
		if (lastTime !== respBody.time.updated) {
			lastTime = respBody.time.updated;

			var k = Object.keys(respBody.bpi);
			for (var i = 0; i < k.length; i++) {
				if (respBody.bpi.hasOwnProperty(k[i])) {
					respBody[k[i].toLowerCase() + '_float'] = respBody.bpi[k[i]].rate_float;
				}
			}

			lastPrice = respBody;

			// trigger bips on price change
			if (lastPriceUSD != respBody.usd_float) {
				lastPriceUSD = respBody.usd_float;

				if (app.isMaster) {
					self._dao.triggerByChannelAction('coindesk.current_price', function(err, msg) {
						self.log(err || msg, channelInfo, err ? 'error' : 'info');
					});
				}
			}
		}
	}
}

CoinDesk.refreshPrice = function() {
	var self = this;
	this._httpGet(url, function() {
		self._setLastPrice.apply(self, arguments);
	});
}

CoinDesk.getLastPrice = function(next) {
	next(false, lastPrice || {});
}

// -----------------------------------------------------------------------------
module.exports = CoinDesk;
