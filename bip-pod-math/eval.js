/**
 *
 * The Bipio Eval Pod.  boilerplate sample action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2013 CloudSpark pty ltd http://www.cloudspark.com.au
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

var math = require('mathjs')();

function Eval(podConfig) {
  this.name = 'eval';
  this.description = 'Eval',
  this.description_long = 'Evaluates a Math expression, exporting the result',
  this.trigger = false;
  this.singleton = true;
  this.auto = true;
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Eval.prototype = {};

Eval.prototype.getSchema = function() {
  return {
    "imports": {
      "properties" : {
        "expression" : {
          "type" :  "string",
          "description" : "Math Expression"
        }
      }
    },
    "exports": {
      "properties" : {
        "result" : {
          "type" : "string",
          "description" : "Expression Result"
        }
      }
    }
  }
}

Eval.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  if (imports.expression) {
    try {
      // need a little utf8 BOM massaging for mathjs
      var exp = new Buffer(
        imports.expression.toString().trim(), 'utf8'
        ).toString('ascii').replace(/B/g, '');

      var result = math.eval(exp);

      next(false, {
        result : result
      });
    } catch (e) {
      next(e.message);
    }
  } else {
    next();
  }
}

// -----------------------------------------------------------------------------
module.exports = Eval;