/**
 *
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
var Pod = require('bip-pod'),
  moment = require('moment-timezone'),
  Time = new Pod({
    name : 'time', // pod name (action prefix)
    description : 'Time',
    description_long : 'Time Manipulation, Formatting, Timezone Conversion + more'
  });

Time.get = function(time) {
  var tNum = Number(time);
  if (!isNaN(tNum)) {
    if (tNum < 9999999999) {
      return moment.unix(tNum);
    } else {
      return moment(tNum);
    }
  } else {
    return moment(time);
  }
}

// Include any actions
Time.add(require('./format.js'));
Time.add(require('./tz_convert.js'));

// -----------------------------------------------------------------------------
module.exports = Time;
