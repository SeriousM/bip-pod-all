function CreateEvent(podConfig) {}

CreateEvent.prototype = {};

/**
 * Invokes (runs) the action.
 *
 */
CreateEvent.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pager = this.pod.getClient(channel);
  console.log(imports);
  pager.create({
	  description: imports.description,
	  client: imports.client,
	  client_url: imports.client_url,
	  details:{
		  "occured":new Date()
	  },
	  callback: function(err, response){
		  if (err){
			  console.log(err);
			  next(err);
		  }
		  else{
			  console.log(response);
			  next(false,response);
		  }
	  }
  })
}

// -----------------------------------------------------------------------------
module.exports = CreateEvent;