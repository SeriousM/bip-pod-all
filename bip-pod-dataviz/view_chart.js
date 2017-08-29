/**
 *
 * Dataviz view chart
 * ---------------------------------------------------------------
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

var ejs = require('ejs');

function View_Chart(podConfig) {
	var self = this,
  	indexPath = __dirname + '/chart/default/index.ejs';

  // attach the ejs template on action construct
	fs.readFile(indexPath, 'utf8', function(err, indexFile) {
		if(err) {
		  self.pod.log(err,
	        {
	          action : 'dataviz',
	          owner_id : 'system'
	        },
	        'error'
	      );
		} else {
			self.indexFile = indexFile;
		}
	});

	this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

View_Chart.prototype = {};

View_Chart.prototype._errorResponse = function (){
	console.log('file not found')
	res.writeHead(500, {
		"Content-Type": "text/plain"
	});

	res.write(err + "\n");
	res.end();
}

View_Chart.prototype.fieldDecorator = function(tplVars, next) {
	var dao = this.$resource.dao,
		self = this;

	dao.find(
		'bip',
		{
			id : tplVars.bip_id
		},
		function(err, result) {
			var typeDefs = self.pod.getActionSchemas()[self.name].config.definitions.chart_types,
				typeEnums = typeDefs.enum,
				typeDefault = typeDefs.default,
				pointsDefs = self.pod.getActionSchemas()[self.name].config.definitions.chart_points,
				pointsDefault = pointsDefs.default;

			// populate sane defaults on error
			if (err || !result) {
				tplVars.y1_series_label = 'y1';
				tplVars.y2_series_label = 'y2';
				tplVars.y_label = 'x';
				tplVars.x_label = 'x';
				tplVars.default_type = typeDefault;
				tplVars.maxPoints = pointsDefault;
			} else {
				var model = dao.modelFactory('bip', result),
					transforms = model.getTransformFor(tplVars.channel_id);

				tplVars.y1_series_label = transforms.y1_series_label && transforms.y1_series_label.trim() || 'y1';
				tplVars.y2_series_label = transforms.y2_series_label && transforms.y2_series_label.trim() || 'y2';

				tplVars.y_label = transforms.y_label && transforms.y_label.trim() || 'y1';
				tplVars.x_label = transforms.x_label && transforms.x_label.trim() || 'x';

				tplVars.default_type = (-1 === typeEnums.indexOf(transforms.default_type) )
					? typeDefault
					: transforms.default_type;

				tplVars.maxPoints = (transforms.maxPoints ? transforms.maxPoints : pointsDefault);

			}

			next(tplVars);
		}
	);
}

View_Chart.prototype.rpc = function(method, sysImports, options, channel, req, res) {
	var self = this;

	if (method === 'view' && !options.hasOwnProperty('data')) {

		if (!this.indexFile) {
			res.status(500).end();

		} else {
			var data_url = req.url.split('?')[0];
			var site_css  = self.pod.options.siteURL.split(':')[1] + '/static/build/css/build.css';
			var site_css  = self.pod.options.siteURL + '/static/build/css/build.css';

			var ejs_template_vars = {
				bip_id:   options.bip_id,
				data_url: data_url,
				since:    options.since,
				site_css: site_css,
				channel_id : channel.id
			}

			this.fieldDecorator(ejs_template_vars, function(tplVars) {
		    res.contentType(self.pod.getActionRPC(self.name, method).contentType);
				res.writeHead(200);
				res.write(ejs.render(self.indexFile, tplVars), "binary");
				res.end();
			});
		}

	} else if (method === 'json' || options.hasOwnProperty('data')) {
    res.contentType(self.pod.getActionRPC(self.name, 'json').contentType);
		self.pod.retrieve(
			options.bip_id,
			channel,
			options.since,
			options.page_size,
			options.page,

			function(err, results) {
				if (err) {
					res.status(500).end();
				} else {
					values = self.$resource._.pluck(results.data, 'value');
					res.status(200).send(values);
				}
			}
		);
	} else {
		res.send(404);
	}
}

View_Chart.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	var data = {
		x : imports.x,
		y1 : imports.y1,
		y2 : imports.y2
	}

	this.pod.save(
		sysImports.bip.id,
		channel,
		sysImports.client.date,
		JSON.stringify(data),
		function(err) {
			next(err, {});
		}
	);
}

// -----------------------------------------------------------------------------
module.exports = View_Chart;
