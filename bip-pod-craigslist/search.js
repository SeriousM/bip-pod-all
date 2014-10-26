/**
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

function Search(podConfig) {
  this.name = 'search';
  this.title = 'Listing Search',
  this.description = 'Export any new listings which match your search query',
  this.trigger = false;
  this.singleton = false;
  this.auto = false;
  this.podConfig = podConfig;
}

Search.prototype = {};

Search.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
      }
    },
    "imports": {
      "properties" : {
        "city" : {
          "type" :  "string",
          "description" : "City"
        },
        "query" : {
          "type" :  "string",
          "description" : "Search"
        },        
        "min" : {
          "type" :  "string",
          "description" : "Min Ask Price"
        },
        "max" : {
          "type" :  "string",
          "description" : "Max Ask Price"
        }
      },
      "required" : [ "city", "query" ]
    },
    "exports": {
      "properties" : {
        "pid" : {
          "type" : "string",
          "description" : "PID"
        },
        "category" : {
          "type" : "string",
          "description" : "Category"
        },
        "date" : {
          "type" : "string",
          "description" : "Date"
        },
        "hasPic" : {
          "type" : "boolean",
          "description" : "Has Picture"
        },
        "location" : {
          "type" : "string",
          "description" : "Location"
        },
        "price" : {
          "type" : "string",
          "description" : "Price"
        },
        "title" : {
          "type" : "string",
          "description" : "Title"
        },
        "url" : {
          "type" : "string",
          "description" : "Listing URL"
        }        
      }
    }
  }
}

Search.prototype.setup = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

Search.prototype.teardown = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}

Search.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  if (imports.city && imports.query) {
    var opts = {
      city : imports.city.replace(/\s*/g, '')
    }
    
    if (imports.min) {
      opts.minAsk = imports.min;
    }
    
    if (imports.max) {
      opts.maxAsk = imports.max;
    }
    
    this.pod.search(imports.query, opts, function(err, listings) {
      if (err) {
        next(err);
      } else {
        for (var i = 0; i < listings.length; i++) {          
          next(false, listings[i]);
        }
      }
    });
  } 
}

// -----------------------------------------------------------------------------
module.exports = Search;
