/**
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

function ProductUpdated() {}

ProductUpdated.prototype = {};

ProductUpdated.prototype.trigger = function() {
  this.invoke.apply(this, arguments);
}

ProductUpdated.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	var productClient = this.pod.getProductClient(sysImports);
console.log(imports);
	productClient.getProduct({ productCode : imports.entityId }).then(
		function() {
console.log(arguments);
		},
		function() {
console.log(arguments);
		}
	);
  next(false, imports);
}

// -----------------------------------------------------------------------------
module.exports = ProductUpdated;
