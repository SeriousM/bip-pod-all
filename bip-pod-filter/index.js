/**
 * 
 * filter Actions and Content Emitters
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
    filter = new Pod({
        name : 'filter', // pod name (action prefix)
        title : 'Filter', // short description
        description : 'Filter Your Content' // long description
    });

// Include any actions
filter.add(require('./entity_encode.js'));
filter.add(require('./entity_decode.js'));
filter.add(require('./regex_replace.js'));
filter.add(require('./text2json.js'));
filter.add(require('./xml2json.js'));
// -----------------------------------------------------------------------------
module.exports = filter;
