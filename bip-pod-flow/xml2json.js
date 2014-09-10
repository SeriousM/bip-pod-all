/**
 *
 * The Bipio Flow Pod.  xml2json action definition
 * ---------------------------------------------------------------
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

var xml2json = require('xml2json');

function XML2JSON(podConfig) {
    this.name = 'xml2json';
    this.title = 'Convert XML to JSON',
    this.description = 'Given an XML document, converts it to usable JSON exports',
    this.trigger = false;
    this.singleton = true;
    this.podConfig = podConfig;
}

XML2JSON.prototype = {};

XML2JSON.prototype.getSchema = function() {
    return {
        "imports": {
            "properties" : {
                "body" : {
                    "type" : String,
                    "description" : "XML Message Body"
                }
            }
        }
    }
}

/**
 * Invokes (runs) the action.
 */
XML2JSON.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    var json = xml2json.toJson(imports.body, { object : true});
    if (json) {
        next(false, json);
    } else {
        next(true, 'Payload could not be parsed');
    }
}

// -----------------------------------------------------------------------------
module.exports = XML2JSON;