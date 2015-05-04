function CreateEvent(podConfig) {}

CreateEvent.prototype = {};

/**
 * Invokes (runs) the action.
 *
 */
CreateEvent.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pager = this.pod.getClient(channel),
  	now = new Date();

  if (!imports.details) {
  	imports.details = {
  		occured : now
  	}
  } else if (!imports.details.occured) {
  	imports.details.occured = now;
  }

  var params = {
	  callback: function(err, response){
		  if (err){
			  next(err);
		  } else {
			  next(false,response);
		  }
	  }
  }

  for (var k in imports) {
  	params[k] = imports[k];
  }

  pager.create(params);
}

// -----------------------------------------------------------------------------
module.exports = CreateEvent;