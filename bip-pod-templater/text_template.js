/**
 *
 * The Bipio Templater Pod.  text_template action definition
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

function TextTemplate(podConfig) {
  this.name = 'text_template';
  this.title = 'Message Template';
  this.description = 'Generic text message';
  this.trigger = false; // @todo - create hybrid type
  this.singleton = false;
  this.auth_required = false;
}

TextTemplate.prototype = {};

TextTemplate.prototype.getSchema = function() {
  return {
    'config' : { // config schema
      properties : {
        'message' : {
          type  : 'text',
          description : 'Default Message',
          required : false
        }
      }
    },
    'exports' : {
      properties : {
        'message' : {
          type : 'text',
          description : 'Templated Message'
        }
      }
    },
    "imports": {
      properties : {
        'message' : {
          type : 'text',
          description : 'Templated Message'
        }
      }
    }
  };
}

/**
 * Invokes (runs) the action.
 */
TextTemplate.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  next(false, {
    message : imports.message || channel.config.message
  });
}

// -----------------------------------------------------------------------------
module.exports = TextTemplate;
