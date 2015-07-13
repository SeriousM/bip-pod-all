/**
 *
 * @author Scott Tuddenhman <scott@wot.io>
 * Copyright (c) 2015 wot.io, Inc. http://wot.io
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

function TxOpReturn() {}

TxOpReturn.prototype = {};

TxOpReturn.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	
	var chain = this.pod._getClient(sysImports.auth, 'testnet3');

	chain.getTransactionOpReturn(imports.hash, function(err, resp) {
		if (err) {
			next(err);
		} else {
			console.log(resp.text);
			console.log('tx op typeof resp | ',typeof resp);
			next(false, resp);
		}
	});
}
// -----------------------------------------------------------------------------
module.exports = TxOpReturn;
