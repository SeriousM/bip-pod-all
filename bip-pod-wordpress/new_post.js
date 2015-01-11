/**
 *
 * The Bipio NewPost Pod.  Wordpress - create a post
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

function NewPost() {}

NewPost.prototype = {};

/**
 * Invokes (runs) the action.
 */
NewPost.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    // whatever comes in, we push straight back out
    next(
        false,
        {
            "outstring" : imports.instring
        }
        );
}

// -----------------------------------------------------------------------------
module.exports = NewPost;