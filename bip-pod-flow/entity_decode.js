/**
 *
 * The Bipio Flow Pod
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
function EntityDecode(podConfig) {
  this.name = 'entity_decode';
  this.title = 'HTML Entity Decode',
  this.description = 'Decodes HTML Entities',
  this.trigger = false;
  this.singleton = true;
  this.podConfig = podConfig;
}

EntityDecode.prototype = {};

EntityDecode.prototype.getSchema = function() {
  return {
    "imports": {
      properties : {
        'funnel' : {
          type : 'string',
          description : 'Content Funnel.  If empty, decodes all adjacent imports'
        }
      }
    }
  }
}

EntityDecode.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var exports = imports;

  if (imports.funnel) {
    next(false, app.helper.naturalize(imports.funnel));
  } else {
    next(false, app.helper.naturalize(imports));
  }
}

// -----------------------------------------------------------------------------
module.exports = EntityDecode;