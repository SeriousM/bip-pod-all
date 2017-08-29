/**
 *
 * The Bipio Validate Pod.  boilerplate sample action definition
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

function Validate() {}

var W3CURL = 'http://validator.w3.org/check?output=json&uri=';

Validate.prototype = {};

Validate.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var GetResource = this.$resource._httpGet;

  GetResource(W3CURL + imports.url, function(err, result, headers, status) {
    if ('none' === imports.aggregate) {
      for (var i = 0; i < result.messages.length; i++) {
        next(false, result.messages[i]);
      }
    } else if ('json' === imports.aggregate) {
      next(false, { message : JSON.stringify(result.messages) } );

    } else if ('text' === imports.aggregate) {
      var textOutput = '', m;
      for (var i = 0; i < result.messages.length; i++) {
        m = result.messages[i];
        textOutput += (m.type + ':L' + m.lastLine + ',C' + m.lastColumn + ':' + m.message + m.explanation + '\n');
      }

      next(err, { message : textOutput })
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = Validate;