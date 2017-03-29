/**
 *
 * Dataviz view json
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

 function View_JSON(podConfig) {
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

View_JSON.prototype = {};

// RPC/Renderer accessor - /rpc/render/channel/{channel id}/hello
View_JSON.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  var self = this;

  if (method === 'view') {
    res.contentType(self.pod.getActionRPC(self.name, method).contentType);
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
          var rawData = [],
            values = self.$resource._.pluck(results.data, 'value');
          self.$resource._.each(values, function(val) {
            try{
            	  rawData.push(JSON.parse(val));

            	} catch (err) {
			    	 console.log("error in parsing " +err);
			    }
          });
          res.status(200).send(rawData);
        }
      }
    );
  } else {
    res.send(404);
  }

}

/**
 * Action Invoker - the primary function of a channel
 *
 * @param Object imports transformed key/value input pairs
 * @param Channel channel invoking channel model
 * @param Object sysImports
 * @param Array contentParts array of File Objects, key/value objects
 * with attributes txId (transaction ID), size (bytes size), localpath (local tmp file path)
 * name (file name), type (content-type), encoding ('binary')
 *
 * @param Function next callback(error, exports, contentParts, transferredBytes)
 *
 */
 View_JSON.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {

  var value;


   try {
	 value=JSON.stringify(imports.value);
    	 JSON.parse(value);
    } catch (err) {
    	 next(err, {});
	}


  this.pod.save(
    sysImports.bip.id,
    channel,
    sysImports.client.date,
    value,
    function(err) {
        next(err, {});
    }
  );

 }

// -----------------------------------------------------------------------------
module.exports = View_JSON;
