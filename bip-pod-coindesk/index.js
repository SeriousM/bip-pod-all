/**
 *
 * CoinDesk Actions and Content Emitters
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
    CoinDesk = new Pod({
        name : 'coindesk', // pod name (action prefix)
        title : 'CoinDesk', // short description
        description : 'Realtime Bitcoin prices Powered by <a href="http://www.coindesk.com/price">CoinDesk</a>' // long description
    },
    function() {
    	var self = this;

    	// refresh prices every 60 seconds
    	setInterval(function() {
    		self.refreshPrice.call(self);
    	}, 10000);
  });

var lastPrice,
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
		// coindesk uses 'application/javascript' content-type ??
		try {
			respBody = JSON.parse(respBody);
		} catch (err) {
			this.log(err, channelInfo, 'error');
			return;
		}

		if (lastTime !== respBody.time.updated) {
			lastTime = respBody.time.updated;

			var k = Object.keys(respBody.bpi);
			for (var i = 0; i < k.length; i++) {
				if (respBody.bpi.hasOwnProperty(k[i])) {
					respBody[k[i].toLowerCase() + '_float'] = respBody.bpi[k[i]].rate_float;
				}
			}

			lastPrice = respBody;

			// fire off triggers
			if (app.isMaster) {
				self._dao.triggerByChannelAction('coindesk.current_price', function(err, msg) {
					self.log(err || msg, channelInfo, err ? 'error' : 'info');
				});
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

// Include any actions
CoinDesk.add(require('./current_price.js'));

// -----------------------------------------------------------------------------
module.exports = CoinDesk;
