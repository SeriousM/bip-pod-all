var Pod = require('bip-pod'),
https = require('https'),
pagerduty = require("pagerduty"),
Pagerduty = new Pod();

Pagerduty.getClient = function(channel){
	return new  pagerduty({
		  serviceKey: channel.config.service_key // required
	});
}

Pagerduty.rpc = function(action, method, sysImports, options, channel, req, res) {
	  var podConfig = this.getConfig();
	  if (method == 'services_list') {
		  var options = {
				  host: sysImports.auth.issuer_token.username+'.pagerduty.com',
				  path: '/api/v1/services',
				  port: '443',
				  headers: { "Content-Type" :"application/json", "Authorization" : "Token token="+sysImports.auth.issuer_token.password},
				};
		  https.get(options, function(response) {
		        // Continuously update stream with data
		        var body = '';
		        response.on('data', function(d) {
		            body += d;
		        });
		        response.on('end', function() {
		            // Data reception is done, do whatever with it!
		        	res.status(200).send(body);
		        });
		    }).on('error', function(err) {
		        // handle errors with the request itself
		        res.status(500).send(err);
		    });

	  } else {
	    this.__proto__.rpc.apply(this, arguments);
	  }
}

module.exports = Pagerduty;