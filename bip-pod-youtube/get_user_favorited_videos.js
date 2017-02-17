/**
 *
 * The Bipio Youtube Pod.  GetUserFavoritedVideos action definition
 * ----------------------------------------------------------------------
 *
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

function GetUserFavoritedVideos(podConfig) {
}

GetUserFavoritedVideos.prototype = {};

GetUserFavoritedVideos.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
    var $resource = this.$resource;

    this.invoke(imports, channel, sysImports, contentParts, function(err, video) {
    	 if (err) {
    	      next(err);
    	    } else {
    	    	
    	    	var exports = {};
    	    	var videoId = video['id']['$t'].split('/').pop(),
    	    	key = 'video_count_' + videoId;
    	    	exports[key] =  video['yt$statistics']['favoriteCount'];
    	    	
    	    	exports['favcount']=video['yt$statistics']['favoriteCount'];
    	    	exports['id'] = videoId;
    	    	exports['published'] = video['published']['$t'];
    	    	exports['updated'] = video['updated']['$t'];
    	    	exports['title'] = video['title']['$t'];
    	    	exports['link'] = video['link'][0]['href'];

    	    	$resource.deltaFilter(exports, key, channel, sysImports, function(err, video) {
    	    		next(err, exports);
    	    	});
    	 }
    });
}

GetUserFavoritedVideos.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	var $resource = this.pod.$resource,
     url = 'http://gdata.youtube.com/feeds/api/users/' + imports.username + '/uploads?alt=json';
    $resource._httpGet(url, function(err, body) {
    	 for (var i = 0; i < body.feed.entry.length; i++) {
    		 next(false, body.feed.entry[i]);
           }
   });
    
}

// -----------------------------------------------------------------------------
module.exports = GetUserFavoritedVideos;
