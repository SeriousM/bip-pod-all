/**
 *
 * The Bipio Validate Pod.  boilerplate sample action definition
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

function Validate() {}

var W3CURL = 'http://validator.w3.org/check?output=json&uri=';

Validate.prototype = {};

Validate.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var GetResource = this.$resource._httpGet;

  GetResource(W3CURL + imports.url, function(err, result, headers, status) {
    if ('none' === imports.aggregate) {
      for (var i = 0; i < result.messages.length; i++) {
        next(false, result.messages[i]);
      }
    } else if ('json' === imports.aggregate) {
      next(false, { message : JSON.stringify(result.messages) } );

    } else if ('text' === imports.aggregate) {
      var textOutput = '', m;
      for (var i = 0; i < result.messages.length; i++) {
        m = result.messages[i];
        textOutput += (m.type + ':L' + m.lastLine + ',C' + m.lastColumn + ':' + m.message + m.explanation + '\n');
      }

      next(err, { message : textOutput })
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = Validate;