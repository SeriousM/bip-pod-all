/**
 *
 * @author Scott Tuddenham <scott@bip.io>
 * Copyright (c) 2014 WoT.IO Inc http://wot.io
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

var ChainNode = require('chain-node');

var Pod = require('bip-pod'),
    Chain = new Pod({
    name : 'chain', // pod name (action prefix)
    title : 'Chain',
    description : '<a href="https://chain.com">Chain</a> enables developers to Build bitcoin apps, not block chain infrastructure.',
    authType : 'issuer_token',
    authMap : {
        username : 'API Key',
        password : 'Secret Key'
    }
    });

Chain.testCredentials = function(struct, next) {
    next('Connection failed', 401)
}

// Include any actions
Chain.add(require('./address.js'));
//Chain.add(require('./transaction.js'));
//Chain.add(require('./unspent.js'));
//Chain.add(require('./opreturn.js'));

// -----------------------------------------------------------------------------
module.exports = Chain;
