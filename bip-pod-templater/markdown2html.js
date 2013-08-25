/**
 * 
 * The Bipio Templater Pod.  text_template action definition
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
var marked = require('marked');

function Markdown2HTML(podConfig) {    
    this.name = 'markdown2html'; 
    this.description = 'Markdown to HTML'; 
    this.description_long = 'Exports Markdown template parsed to HTML';
    this.trigger = false; // @todo - create hybrid type
    this.singleton = false;
    this.auto = true;
    this.auth_required = false;
}

Markdown2HTML.prototype = {};

Markdown2HTML.prototype.getSchema = function() {
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
                    type : 'string',
                    description : 'Templated Markdown Message'
                }
            }
        },
        "imports": {
            properties : {
                'message' : {
                    type : 'string',
                    description : 'Templated Markdown Message'
                }
            }
        }
    };
}

/**
 * Invokes (runs) the action.
 */
Markdown2HTML.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    var exports = {};

    if (!imports.message || '' === imports.message) {
        exports.message = channel.config.message;
    } else {
        exports.message = imports.message;
    }
    
    exports.message = marked(exports.message);
    
    next(
        false, 
        {
            message : marked(exports.message)
        }        
    );
}

// -----------------------------------------------------------------------------
module.exports = Markdown2HTML;
