/**
 *
 * dataviz Actions and Content Emitters
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
var Pod = require('bip-pod'),
    DataViz = new Pod(
    	{},
    	function() {
    		var self = this;

    		this.registerCron(
    			this.name,
    			'0 0 * * * *',
    			function() {
    				var expireSeconds = 60 * 60 * 24 * 1; // 1 day
		    			modelName = self.$resource.getDataSourceName('data');

    				self.$resource.dao.removeFilter(
    					modelName,
    					{
    						created : {
    							$lt : self.$resource.moment().unix() - expireSeconds
    						}
    					},
    					function(err) {
    						if (!err) {
	    						self.$resource.log(modelName + ' TRUNCATED', { action : 'dataviz', owner_id : 'system'});
	    					}
    					}
  					);
    			}
  			);
    	}
  	);

DataViz.save = function(bipId, channel, created, dataStr, next) {
	var modelName = this.$resource.getDataSourceName('data'),
		model = this.$resource.dao.modelFactory(
			modelName,
			{
				bip_id : bipId,
				channel_id : channel.id,
				owner_id : channel.owner_id,
				created : this.$resource.moment().unix(),
				value : dataStr
			}
		);

	this.$resource.dao.create(model, next);
}

DataViz.retrieve = function(bipId, channel, since, pageSize, page, next) {
	var modelName = this.$resource.getDataSourceName('data'),
		filter = {
			bip_id : bipId,
			channel_id : channel.id,
			owner_id : channel.owner_id
		}

	if (since) {
		filter.created = {
			$gt : Number(since)
		}
	}

	this.$resource.dao.list(
		modelName,
		null,
		pageSize || 0,
		page || 1,
		[ 'created', 'desc' ],
		filter,
		function(err, modelName, results) {
			next(err, results);
		}
	);
}

// -----------------------------------------------------------------------------
module.exports = DataViz;
