/**
 *
 * @author Michael Pearson <michael@bip.io>
 * Copyright (c) 2010-2014 WoT.IO
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

function OnNewAlert(podConfig) {
  this.name = 'on_new_alert';
  this.title = 'On a New Alert';
  this.description = 'Triggers On a New Alert';
  this.trigger = true;
  this.singleton = false;
  this.auto = false;
  this.podConfig = podConfig;
}

OnNewAlert.prototype = {};

OnNewAlert.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
      }
    },
    "imports": {
      "properties" : {
      }
    },
    "exports": {
      "properties" : {
        "_value" : {
          "type" : "string",
          "description" : "Alert Value"
        },
        "_alert_url" : {
          "type" : "string",
          "description" : "Alert URL"
        },
        "_metric_name" : {
          "type" : "string",
          "description" : "Metric Name"
        },
        "_metric_notes" : {
          "type" : "string",
          "description" : "Metric Notes"
        },
        "_metric_link" : {
          "type" : "string",
          "description" : "Metric Link"
        },
        "_severity" : {
          "type" : "string",
          "description" : "Severity"
        },
        "_cid" : {
          "type" : "string",
          "description" : "Alert ID"
        },
        "_occurred_on" : {
          "type" : "string",
          "description" : "UTC Unix Time"
        }
      }
    }
  }
}

OnNewAlert.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource;

  this.pod.apiGetRequest('/alert', sysImports, function(err, res, headers, statusCode) {
    if (err || 200 !== statusCode) {
      next(err || res.message);
    } else if (app.helper.isArray(res)) {
      for (var i = 0; i < res.length; i++) {
        $resource.dupFilter(res[i], '_cid', channel, sysImports, function(err, alert) {
          if (err) {
            next(err);
          } else {
            console.log(alert);
            next(false, alert);
          }
        });
      }
    } else {
      next('Malformed Response ' + res);
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = OnNewAlert;
