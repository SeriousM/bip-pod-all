/**
 *
 * Mozue Actions and Content Emitters
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
    Mozu = new Pod(),
    Q = require('q');

// -----------------------------------------------------------------------------

var client = require('mozu-node-sdk/clients/platform/application')({
    context: {
      "appKey": "bipio.bipio.1.0.0.release",
      "sharedSecret": "<secret>",
      "baseUrl": "https://sandbox.mozu.com/",
      "basePciUrl" : "https://crds.mozu.com/",
      "developerAccountId": "<account>",
      "developerAccount": {
          "emailAddress": "michael@bip.io",
          "password": "<password>"
      }
    }
  }),
  AppClient = require('mozu-node-sdk/clients/commerce/settings/application');
 ProductClient = require('mozu-node-sdk/clients/commerce/catalog/admin/product');

Mozu.testCredentials = function(struct, next) {

  var appsClient = AppClient();

  appsClient.context.tenant = struct.username;

  appsClient.thirdPartyGetApplication().then(function(struct) {
    if (undefined !== struct.initialized) {
      struct.initialized = true;
      struct.enabled = true;
      appsClient.thirdPartyUpdateApplication(struct).then(
        function() {
          next(false, 200);
        },
        function(err) {
          next(err, 500);

        }
      );
    }
  },
  function(err) {
    next(err, 500);
  });
}

Mozu.getProductClient = function(sysImports) {
  var productClient = ProductClient();
  productClient.context.tenant = sysImports.auth.issuer_token.username;
  return productClient;
}

Mozu.rpc = function(action, method, sysImports, options, channel, req, res) {
  var podConfig = this.getConfig(),
    self = this,
    dao = this.getDao();

  if (method == 'bridge' && req.body && req.body.topic) {
  	var action = req.body.topic.replace('.', '_'),
  		bipIds = [];
console.log('ACTION TIME ', method, req.body);

  	if (this.actions[action]) {
  		// find bips with action as this topic, or where channel id's exist
      dao.getTriggerBipsByAction(
        action,
        function(err, filter) {
          if (err) {
            res.status(500).end();
          } else {
            // !!IMPORTANT demo purposes only, performs no tracking or scheduling
            // copy & pasting relevant bits of bastion to get working
            dao.findFilter(
              'bip',
              filter,
              function(err, bips) {

                var exports, invokeChannel, bip;

                if (!err) {

                  // create transform set
                  var transforms = {
			},
                    reqAttrs = Object.keys(req.body);

                  for (var i = 0; i < reqAttrs.length; i++) {
                    // cast everything to strings for now
                    transforms[reqAttrs[i]] = String(req.body[reqAttrs[i]]);
                  }

                  for (var i = 0; i < bips.length; i++) {
                    bip = dao.modelFactory('bip', JSON.parse(JSON.stringify(bips[i])));

                    exports = {
                      _bip : bip,
                      _client : {},
                      source : app._.clone(req.body)
                    }

                    invokeChannel = dao.modelFactory(
                      'channel',
                      {
                        'id' : 'mozu.' + action,
                        'action' : 'mozu.' + action,
                        'owner_id' : sysImports.owner_id
                      }
                    );

                    invokeChannel.invoke(
                      exports, // imports
                      transforms, // transforms
                      {}, // client
                      {}, // content parts
                      function(err, exports) {
                        if (!err) {
                          app.bastion.distributeChannel(
                            bip,
                            'source',
                            '',
                            '',
                            {
_bip : bip,
_client : {},
				'source' : exports
				},
                            {},
                            {}
                          );
                        }
                      }
                    );
                  }
                }
              }
            );
          }
        },
        sysImports.owner_id
      );

      res.status(200).end();

		} else {
			// unsupported topic
			res.status(501).send({ message : 'Unsupported Topic ' + req.body.topic});
		}

  	res.status(200).send();

  } else if (method === 'bridge') {
  	res.status(501).end();

  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

module.exports = Mozu;
