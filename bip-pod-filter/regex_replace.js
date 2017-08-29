/**
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

var safeRegex = require('safe-regex');

function RegExpReplace(podConfig) {
  this.name = 'regex_replace';
  this.title = 'Regex Replace',
  this.description = 'Replace a String by Regulr Expression',
  this.trigger = false;
  this.singleton = true;
  this.podConfig = podConfig;
}

RegExpReplace.prototype = {};

RegExpReplace.prototype.getSchema = function() {
  return {
    "imports": {
      properties : {
        'in_str' : {
          type : 'string',
          description : 'Input String'
        },
        'repl_str' : {
          type : 'string',
          description : 'Replace String'
        },
        'regex' : {
          type : 'string',
          description : 'Regular Expression'
        }
      }
    },
    "exports": {
      properties : {
        'out_str' : {
          type : 'string',
          description : 'Output String'
        }
      }
    }
  }
}

RegExpReplace.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  if (imports.in_str && imports.repl_str && imports.regex) {
    if (safeRegex(imports.regex)) {
      try {
        var exports = {
            out_str : imports.in_str.replace(new RegExp(imports.regex, 'gi'), imports.repl_str)
          };

        next(false, exports);
      } catch (e) {
        next(e.message);
      }
    } else {
      next('Regex ' + imports.regex + ' is unsafe');
    }
  } else {
    // silent passthrough
    next(false, {});
  }
}

// -----------------------------------------------------------------------------
module.exports = RegExpReplace;