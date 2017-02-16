/**
 *
 * The Bipio Bitly Pod
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

function Expand() {}

Expand.prototype = {};

Expand.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var uri = 'https://api-ssl.bitly.com/v3/info?shortUrl=';
  uri += encodeURIComponent(imports.short_url) + '&access_token=' + sysImports.auth.oauth.access_token;
  this.pod._httpGet(uri, function(err, bodyJSON) {
  	var errStr, payload;
  	if (err) {
  		errStr = err;
  	} else if ( bodyJSON.status_code !== 200) {
  		errStr =  bodyJSON.status_txt
  	}

  	if (bodyJSON.data && bodyJSON.data.info) {
  		payload = bodyJSON.data.info.shift();
  	}
    next(errStr, payload, contentParts, 0);
  });
}

// -----------------------------------------------------------------------------
module.exports = Expand;