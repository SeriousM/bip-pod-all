/**
 *
 * The Bipio Unbabel Pod
 * ---------------------------------------------------------------
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

function GetDeliveredTranslations() {
}

GetDeliveredTranslations.prototype = {};

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