/**
 *
 * The Bipio Search Pod.
 * ---------------------------------------------------------------
 *
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
 *
 */

function Search(podConfig) {
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Search.prototype = {};

Search.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    $resource = this.$resource;

  this.invoke(imports, channel, sysImports, contentParts, function(err, exports) {
    if (err) {
      next(err);
    } else {
      $resource.dupFilter(exports, 'question_id', channel, sysImports, function(err, item) {
        next(err, item);
      });
    }
  });
}

Search.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	var url = "https://api.stackexchange.com/2.2/search?order=desc&sort=activity&site=" + imports.site + "&intitle=" + imports.query;
	this.$resource._httpGet(url, function(err, body, headers, statusCode) {
		if (err) {
			next(err);
		} else if (body.items) {
			for (var i = 0; i < body.items.length; i++) {
				next(false, body.items[i]);
			}
		}
	});
}

// -----------------------------------------------------------------------------
module.exports = Search;
