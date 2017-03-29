function SetLightState() {
}

SetLightState.prototype = {};

SetLightState.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
    var $resource = this.$resource;
    this.invoke(imports, channel, sysImports, contentParts, next);
}

SetLightState.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	/*
	 {
	    "on": true,
	    "bri": 200,
	    "hue": 50000,
	    "sat": 0,
	    "xy": [
	      0,
	      0
	    ],
	    "ct": 0,
	    "alert": "test",
	    "effect": "none",
	    "colormode": "hs",
	    "reachable": true
	  }
	 */

	var $resource = this.pod.$resource;

    imports.bridge ? imports.bridge : imports.bridge = "http://192.168.0.36";
    imports.username ? imports.username : imports.username = "newdeveloper";
    
	var url = imports.bridge + '/api/'+ imports.username +'/lights/'+imports.lightId + '/state';

    delete imports.bridge;
	delete imports.username;
	delete imports.lightId;

    for (var type in imports) {
        typeof imports[type] !== Number ? imports[type] = Number(imports[type]) : imports[type];
    }


    $resource._httpPut(url,imports, function(err, body) {
    
        err ? next(err) : next(false, body);

     });
    
}

// -----------------------------------------------------------------------------
module.exports = SetLightState;
