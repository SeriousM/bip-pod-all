/**
 *
 * The Bipio Alchemy Pod.  Alchemy Actions and Content Emitters
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2013 Michael Pearson https://github.com/mjpearson
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
  request = require('request'),
  Alchemy = new Pod();

Alchemy.post = function(method, params, sysImports, next) {
  var args = {
  };

  for (var k in params) {
    if (params.hasOwnProperty(k)) {
      args[k] = params[k];
    }
  }

  params.apikey = sysImports.auth.issuer_token.password;
  params.outputMode = 'json';

  request.post(
    'http://access.alchemyapi.com/calls/' + method,
    {
      form : params
    },
    function(err, res, body) {
      if (err) {
        next(err);
      } else {
        try {
          body = JSON.parse(body);
          if ('ERROR' === body.status) {
            var msg = body.statusInfo;

            if (body.usage) {
              msg += ':' + body.usage;
            }

            next(msg);
          } else {
              next(false, body);
          }
        } catch (e) {
          next(e.message);
        }
      }
    }
  );
}

// -----------------------------------------------------------------------------
module.exports = Alchemy;
