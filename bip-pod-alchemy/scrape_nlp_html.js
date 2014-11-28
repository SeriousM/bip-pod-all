/**
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2013 Michael Pearson https://github.com/mjpearson
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

function ScrapeHTML() {}

ScrapeHTML.prototype = {};

ScrapeHTML.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  this.pod.post(
    'html/HTMLGetConstraintQuery',
    {
      html : imports.html,
      cquery : imports.query
    },
    sysImports,
    function(err, body) {
      if (err) {
        next(err);
      } else {
        if (body.queryResults && body.queryResults.length) {
          for (var i = 0; i < body.queryResults.length; i++) {
            next(false, body.queryResults[i]);
          }
        }
      }
    }
  );
}

// -----------------------------------------------------------------------------
module.exports = ScrapeHTML;
