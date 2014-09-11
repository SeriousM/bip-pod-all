/**
 *
 * The Bipio Unbabel Pod
 * ---------------------------------------------------------------
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

function GetDeliveredTranslations(podConfig) {
  this.name = 'get_delivered'; // action name (channel action suffix - "action: unbabel.simple")
  this.title = 'Get Newly Delivered Translation', // short description
  this.description = 'Distribute a newly delivered translation', // long description
  this.trigger = true; // this action can trigger
  this.singleton = true; // 1 instance per account (can auto install)
  this.auto = true; // automatically install this action
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

GetDeliveredTranslations.prototype = {};

// GetDeliveredTranslations schema definition
// @see http://json-schema.org/
GetDeliveredTranslations.prototype.getSchema = function() {
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
        "status" : {
          "type" : "string",
          "description" : "Status"
        },
        "text" : {
          "type" : "string",
          "description" : "Translated Text"
        },
        "target_language" : {
          "type" : "string",
          "description" : "Target Language"
        },
        "source_language" : {
          "type" : "string",
          "description" : "Source Language"
        },
        "uid" : {
          "type" : "string",
          "description" : "Transaction ID"
        },
        "price_euro" : {
          "type" : "string",
          "description" : "Price &euro;EUR"
        }
      }
    },
    'renderers' : {
      'update_status' : {
        description : 'Update Tracking Status',
        description_long : 'Updates the internally tracked status for a translation UID to something new',
        contentType : DEFS.CONTENTTYPE_JSONL
      }
    }
  }
}

// retrieves current translations
GetDeliveredTranslations.prototype.setup = function(channel, accountInfo, next) {
  var $resource = this.$resource,
    dao = $resource.dao,
    modelName = this.$resource.getDataSourceName('translation_tracking');

  // get all current transactions
  this.pod.requestGET(
    'translation',
    {
      status : 'delivered'
    },
    {
      auth : accountInfo._setupAuth
    },
    function(err, result) {
      next(err, 'channel', channel); // ok
    }
  );
}

// removes any translation trackers
GetDeliveredTranslations.prototype.teardown = function(channel, accountInfo, next) {
  var $resource = this.$resource,
    dao = $resource.dao,
    modelName = this.$resource.getDataSourceName('track_translation');

  dao.removeFilter(modelName, {
    id : channel.id
  }, next );
}

GetDeliveredTranslations.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  // get all current transactions
  this.pod.requestGET(
    'translation',
    {
      status : 'delivered'
    },
    {
      auth : sysImports.auth.issuer_token.password
    },
    function(err, result) {
      console.log(arguments);
      next(err, 'channel', channel); // ok
    }
  );
}

// -----------------------------------------------------------------------------
module.exports = GetDeliveredTranslations;