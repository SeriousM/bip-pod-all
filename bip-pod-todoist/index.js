/**
 *
 * The Bipio Todoist Pod
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
var Pod = require('bip-pod'),
Todoist = new Pod({
  name : 'todoist', // pod name (action prefix)
  description : 'Todoist', // short description
  description_long : 'Trusted by over 1 million people, Todoist is the best online task management app and to-do list.', // long description
  authType : 'issuer_token',
  authMap : {
    password : 'API Token'
  }
});


Todoist.getProjectSchema = function() {
  return {
    "properties" : {
      "id" : {
        "type" :  "integer",
        "description" : "ID"
      },
      "name" : {
        "type" :  "string",
        "description" : "Name"
      },
      "color" : {
        "type" :  "string",
        "description" : "Label Color"
      },
      "is_archived" : {
        "type" :  "integer",
        "description" : "Is Archived"
      },
      "is_deleted" : {
        "type" :  "integer",
        "description" : "Is Archived"
      },
      "inbox_project" : {
        "type" :  "boolean",
        "description" : "Is InBox"
      },
      "last_updated" : {
        "type" :  "string",
        "description" : ""
      }
    }
  }
}

//
Todoist.getRequest = function(method, sysImports, params, next) {
  var p = [];
  for (var k in params) {
    if (params.hasOwnProperty(k)) {
      p.push(k + '=' + params[k]);
    }
  }

  this._httpGet(
    'https://todoist.com/API/' + method + '?token=' + sysImports.auth.issuer_token.password + '&' + p.join('&'),
    next
    );
}

// Include any actions
Todoist.add(require('./add_item.js'));

// -----------------------------------------------------------------------------
module.exports = Todoist;
