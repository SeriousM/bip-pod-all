/**
 *
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
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
  dns = require('dns'),
  tldtools = require('tldtools'),
  DNS = new Pod({
    name : 'dns', // pod name (action prefix)
    title : 'DNS',
    description : 'Host, whois and general discovery with the global Domain Name System'
  });

tldtools.init();

DNS.tldTools = function() {
  return tldtools;
}

DNS.get = function() {
  return dns;
}

// Include any actions
DNS.add(require('./get_gtld.js'));
DNS.add(require('./whois.js'));
DNS.add(require('./lookup.js'));
DNS.add(require('./resolve_mx.js'));
DNS.add(require('./reverse.js'));

// -----------------------------------------------------------------------------
module.exports = DNS;
