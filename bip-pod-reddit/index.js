/**
 *
 * Reddit Pod for Bip.IO
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



var Pod = require('bip-pod'),
    Reddit = new Pod();


Reddit.getApiUrl = function() {

	var BASE_URL = 'http://www.reddit.com/api/';
	var API_VERSION = this.getSchema().version;
	var API_URL = BASE_URL + API_VERSION + '/';

	return API_URL;
}


// -----------------------------------------------------------------------------
module.exports = Reddit;
