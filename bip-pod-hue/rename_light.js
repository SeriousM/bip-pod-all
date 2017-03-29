function renameLight() {
}

renameLight.prototype = {};

renameLight.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
	var $resource = this.$resource;
    this.invoke(imports, channel, sysImports, contentParts, next);
}

renameLight.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	var $resource = this.pod.$resource;

    imports.bridge ? imports.bridge : imports.bridge = "http://192.168.0.36";
    imports.username ? imports.username : imports.username = "newdeveloper";
 
	var url = imports.bridge + '/api/'+ imports.username +'/lights/'+ imports.lightId;

     $resource._httpPut(url, {"name": imports.name } , function(err, body) {
        err ? next(err) : next(false, body);
     });
    
}

// -----------------------------------------------------------------------------
module.exports = renameLight;
