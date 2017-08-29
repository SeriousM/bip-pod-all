/**
 *
 * The Bipio DOMSelect Pod.  boilerplate sample action definition
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

var jsdom = require('jsdom'),
  fs = require('fs'),
  url = require('url'),
  jquery = fs.readFileSync(__dirname + '/jquery-min.js');

function DOMSelect(podConfig) {}

DOMSelect.prototype = {};

DOMSelect.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var isHTTPRequest = 0 === imports.source.toLowerCase().indexOf('http'),
    conf = {
      src: [ jquery ],
      done: function (err, window) {
        if (err) {
          next(err);
          window.close();
        } else {
          var $ = window.$;
          try {
            $(imports.selector).each(function () {
              var $this = $(this),
              exports = {
                html : $this.html(),
                text : $this.text()
              }

              if (imports.attr) {
                exports.attr = $this.attr(imports.attr);

                if (0 === exports.attr.indexOf('/') && isHTTPRequest ) {
                  var urlTokens = url.parse(imports.source);
                  exports.attr = urlTokens.protocol + '//' + urlTokens.hostname + exports.attr;
                }
              }

              next(false, exports);
            });

            window.close();
          } catch (e) {

            next(e);
            window.close();
          }
        }
      }
    };

  if (isHTTPRequest) {
    conf.url = imports.source;
  } else {
    conf.html = imports.source;
  }

  jsdom.env(conf);
}

// -----------------------------------------------------------------------------
module.exports = DOMSelect;