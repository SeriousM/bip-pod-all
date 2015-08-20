/**
 *
 * pushbullet Actions and Content Emitters
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
https = require('https'),
PushBullet = new Pod();

PushBullet.pushbulletRequest = function(path, params, sysImports, next, method) {
  var opts = {
    host: 'api.pushbullet.com',
    port: 443,
    path: '/v2/' + path,
    method: method || 'GET',
    headers : {
      'Authorization' : 'Bearer ' + sysImports.auth.issuer_token.username
    }
  }, paramStr;

  if ('POST' === method && params) {
    paramStr = JSON.stringify(params);
    opts.headers['Content-Type'] = 'application/json';
    opts.headers['Content-Length'] = paramStr.length;
  }

  var req = https.request(opts, next);

  if ('POST' === method) {
    req.write(paramStr);
  }

  req.end();
}

PushBullet.pushbulletRequestParsed = function(path, params, sysImports, next, method) {
  this.pushbulletRequest(path, params, sysImports, function(res) {
    res.setEncoding('utf8');
    var data = "";
    res.on('data', function(d) {
      data += d;
    });
    res.on("end", function() {

      if(res.statusCode !== 200) {
        next(data);
      } else {
        try {
          next(false, JSON.parse(data));
        } catch (e) {
          next(e.message);
        }
      }
    });
  }, method);
}

PushBullet.rpc = function(action, method, sysImports, options, channel, req, res) {
  var pod = this.pod;

  if (method == 'my_devices') {
    this.pushbulletRequest('devices', {}, sysImports, function(pRes) {
      pRes.pipe(res);
    });
  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

// -----------------------------------------------------------------------------
module.exports = PushBullet;
