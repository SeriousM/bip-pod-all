/**
 *
 * The Bipio Flow Pod.  match action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2014 CloudSpark pty ltd http://www.cloudspark.com.au
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
var safeRegex = require('safe-regex');
function Match(podConfig) {
  this.name = 'match';
  this.description = 'Filter messages by a search pattern',
  this.description_long = 'Conditionally forwards or discards messages matching certain search patterns',
  this.trigger = false;
  this.singleton = false;
  this.podConfig = podConfig;
}

Match.prototype = {};

Match.prototype.getSchema = function() {
  return {
    'config' : {
      properties : {
        accept_on : {
          type: "string",
          description: 'Accept if content matches',
          optional: true
        },
        discard_on : {
          type: "string",
          description: 'Discard if content matches',
          optional: true
        }
      }
    },
    "imports": {
      properties : {
        accept_on : {
          type: "string",
          description: 'Accept if content matches',
          optional: true
        },
        discard_on : {
          type: "string",
          description: 'Discard if content matches',
          optional: true
        },
        'funnel' : {
          type : 'string',
          description : 'Content Funnel.  If empty, matches any import'
        }
      }
    }
  }
}

function valueMatch(pattern, val) {
  var reg = new RegExp(pattern),
  match = false;

  if (Object.prototype.toString.call(val) === '[object Object]') {
    for (var key in val) {
      match = reg.test(val[key]);
      if (match) {
        break;
      }
    }
  } else {
    match = val && reg.test(val);
  }

  return match;
}

/**
 * Invokes (runs) the action.
 */
Match.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var exports = imports,
  validRegex = false,
  pass,
  acceptOn = imports.accept_on || channel.config.accept_on,
  discardOn = imports.discard_on || channel.config.discard_on,
  matchOn = imports.funnel || imports;

  if (acceptOn) {
    if (safeRegex(acceptOn)) {
      pass = valueMatch(acceptOn, matchOn);
    } else {
      next('Regex ' + acceptOn + ' is unsafe');
    }
  }

  if (discardOn) {
    if (safeRegex(discardOn)) {
      if (valueMatch(discardOn, imports, key)) {
        pass = false;
      }
    } else {
      next('Regex ' + discardOn + ' is unsafe');
    }
  }

  if (pass) {
    next(false, {});
    return;
  }
}

// -----------------------------------------------------------------------------
module.exports = Match;