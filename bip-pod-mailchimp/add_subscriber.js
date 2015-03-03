/**
 *
 * AddSubscriber
 * ---------------------------------------------------------------
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

function AddSubscriber(podConfig) {
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

AddSubscriber.prototype = {};

AddSubscriber.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  var self = this;
  if (method === 'get_lists') {
    res.contentType(self.pod.getActionRPC(self.name, method).contentType);
    this.pod.getList(sysImports, function(err, result) {
      if (err) {
        res.send(err, 500);
      } else {
        res.send(result);
      }
    });
  } else {
    res.send(404);
  }
}

AddSubscriber.prototype.setup = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

AddSubscriber.prototype.teardown = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

AddSubscriber.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var log = this.$resource.log,
    rl = this.$resource.rateLimit,
    args;

  if (channel.config.list_id && imports.email) {
    args = {
      id : channel.config.list_id,
      email : {
        email : imports.email
      }
    };
    this.pod.callMC('lists', 'subscribe', args, sysImports, function(err, response) {
      next(err, response);
    });
  }
}

// -----------------------------------------------------------------------------
module.exports = AddSubscriber;