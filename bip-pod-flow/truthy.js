/**
 *
 * The Bipio Flow Pod.  match action definition
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
function Truthy() {}

Truthy.prototype = {};

Truthy.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var val = ((imports && imports.value)
      ? imports.value.toString().trim().toLowerCase()
      : null),
    truthy = (true === val || /1|yes|y|true/g.test(val));

  if (truthy) {
    next(false, {});
  }
}

// -----------------------------------------------------------------------------
module.exports = Truthy;
