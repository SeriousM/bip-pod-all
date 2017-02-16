/**
 *
 * The Bipio MixCloud Pod
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

function OEmbed() {}

OEmbed.prototype = {};

OEmbed.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var uri = '/oembed?format=json',
    pod = this.pod,
    opts = {}

  opts.url = imports.url;
  pod._testAndSet(imports, opts, 'maxwidth');
  pod._testAndSet(imports, opts, 'maxheight');
  pod._testAndSet(imports, opts, 'autoplay');
  pod._testAndSet(imports, opts, 'words');

  var getStr = '';
  for (var k in opts) {
    if (opts.hasOwnProperty(k)) {
      getStr += '&' + k + '=' + opts[k];
    }
  }

  pod._httpGet('http://www.mixcloud.com' + uri + getStr, function(err, bodyJSON) {
    next(err, bodyJSON);
  });
}

// -----------------------------------------------------------------------------
module.exports = OEmbed;