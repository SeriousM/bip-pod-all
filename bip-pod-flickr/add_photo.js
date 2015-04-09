var FormData = require('form-data'),
  https = require('https');
fs = require('fs');
  

function AddPhoto() {}

AddPhoto.prototype = {};

AddPhoto.prototype._postPhoto = function(channel, params, sysImports, next) {
	  var log = this.$resource.log,
	    client = this.pod.getClient(sysImports);
		  pod.getClient(sysImports, function(err, client) {
			    if (err) {
			      next(err);
			    } else {
			    	var uploadOptions = {
			    		    photos: [{
			    		      title: params.title,
			    		      photo: params.url
			    		    }]
			    		  };
			    	client.upload(uploadOptions,sysImports,function(err,result){
			    		if(err){
						      next(err);
			    		}
			    		else{
			    			next(false,result);
			    		}
			    	})
			    }
		  });
	}

AddPhoto.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
	  var log = this.$resource.log,
	    self = this,
	    client = this.pod.getClient(sysImports),
	    params = this.pod.initParams(sysImports),
	    moment = this.$resource.moment,
	    f, p, requestUrl;

	  params.message = imports.message;
	  if (contentParts._files && contentParts._files.length) {
	    for (var i = 0; i < contentParts._files.length; i++) {
	      f = contentParts._files[i];
	      // post the first image found
	      if (0 === f.type.indexOf('image')) {

	        this.$resource.file.get(f, function(err, fileStruct, stream) {
	          if (err) {
	            next(err);
	          } else {
	            var form = new FormData();
	            form.append('source', stream); 
	            requestUrl = '?title=' + imports.title;
	            

	            var options = {
	                method: 'post',
	                host: 'http://up.flickr.com/services/upload/',
	                path: requestUrl,
	                headers: form.getHeaders()
	            }

	            //Do POST request, callback for response
	            var request = https.request(options, function (res){
	              if (200 === res.statusCode) {
	                res.on('data', function(data) {
	                  var resp = JSON.parse(data);
	                  next(false, resp, contentParts, f.size);
	                });

	                res.on('end', function() {
	                })
	              } else {
	                next(res.headers['www-authenticate']);
	              }
	            });

	            request.on('error', function (error) {
	              next(error);
	            });

	            form.pipe(request);
	          }
	        });
	        break;
	      }
	    }
	  } else {
	    if (imports.url) {
	      params.url = imports.url;
	      params.title = imports.title;
	      this._postPhoto(channel, params, sysImports, next);
	    }
	  }

	}

module.exports = AddPhoto;