function GetLights() {
}

GetLights.prototype = {};

GetLights.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
	var $resource = this.$resource;
    this.invoke(imports, channel, sysImports, contentParts, next);
}

GetLights.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	
    var $resource = this.pod.$resource;


    imports.bridge ? imports.bridge : imports.bridge = "http://192.168.0.36";
    imports.username ? imports.username : imports.username = "newdeveloper";
 

    var url = imports.bridge + '/api/'+ imports.username +'/lights';
    
    $resource._httpGet(url, function(err, body) {
        if (!err) {
            for (var key in body) {
			    var returnValue = {
				    'id': key ,
					'name': body[key].name
				}
                next(err, returnValue)
		    }
        } else {
    		next(err, body);
        }
    });
}

// -----------------------------------------------------------------------------
module.exports = GetLights;
