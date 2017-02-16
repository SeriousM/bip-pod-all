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

var math = require('mathjs')();

function Eval(podConfig) {}

Eval.prototype = {};

Eval.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  try {
    // need a little utf8 BOM massaging for mathjs
    var exp = new Buffer(
      imports.expression.toString().trim(), 'utf8'
      ).toString('ascii').replace(/B/g, '');

    var result = math.eval(exp);

    next(false, {
      result : result
    });
  } catch (e) {
    next(e.message);
  }
}

// -----------------------------------------------------------------------------
module.exports = Eval;
