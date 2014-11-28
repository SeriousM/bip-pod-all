/**
 *
 * The Bipio DOMSelect Pod.  boilerplate sample action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
          } catch (e) {
            next(e);
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