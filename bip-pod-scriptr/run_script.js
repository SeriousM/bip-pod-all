/**
 *
 * The Bipio Scriptr Pod.  runScript action definition
 * ---------------------------------------------------------------
 *  Runs a script
 * ---------------------------------------------------------------
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
 */
var request = require('request'),
  qs = require('querystring'),
  url = require('url'),
  path = require('path');

function RunScript() {}

RunScript.prototype = {};




function parseHeaders(headerStr) {
  var lines = headerStr.split(/\r?\n/),
    headers = {},
    tokens,
    k;

  for (var i = 0; i < lines.length; i++) {
    if (lines[i]) {
      tokens = lines[i].split(':');
      k = tokens.shift();
      headers[k] = tokens.join(':').trim();
    }
  }
  return headers;
}

function scriptrRequest(options, resource, channel, contentParts, pod, next) {
    dataDir = pod.getDataDir(channel, 'run_script');
    var localPath = dataDir;
	return (function(options, resource, channel, contentParts, pod, next) {
		request(options,
      function(err, res, body) {
        if (err) {
          next(err);
        } else {
          if ( res.statusCode !== 200) {
          	var errorObj = {};

          	if(/text\/xml;/.test(res.headers['content-type'])) { //Temporary, later all will be json
          		errorObj["errorCode"] = "INVALID_BEARER_TOKEN";
          	} else if(/text\/javascript;/.test(res.headers['content-type'])) {
          		errorObj = JSON.parse(body).response.metadata;
          	}
          	next('Request Failed ' + JSON.stringify(errorObj));
          } else {
          	if(!res.headers['content-disposition'] && !(/attachment/).test(res.headers['content-disposition'])) {
              var result;
              try {
                result = JSON.parse(body);
                result = result.response.result;
              } catch (e) {
              }

          		next(false, {
                    response : body,
                    result : result
                });
          	}
          }
        }
      }).on("response", function(res){
    	  if(res.headers['content-disposition'] && (/attachment/).test(res.headers['content-disposition'])) {
				localPath += res.headers['content-disposition'].split('=').pop();
				res.pause(); //Michael suggested having this as it might help solve short lived streams problem
      		   	resource.file.save(localPath, res, {persist: false}, function(err, fileStruct) {
                 if (err) {
                     next(err);
                   } else {
                     contentParts._files.push(fileStruct);
                     next(
                       false,
                       {},
                       contentParts,
                       fileStruct.size
                     );
                   }
                 });
			}
		})

	})(options, resource, channel, contentParts, pod, next);
}

RunScript.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource,
  	struct = {},
    options = {},
    headers = {},
    self = this,
    invokeArgs = arguments,
    f;

  options.method = imports.method;

  options.url = this.pod.getConfig()["api_base"] + this.pod.getConfig()["script_path"] + imports.script_name;

  if (imports.headers) {
    headers = parseHeaders(imports.headers);
  }
  headers['Authorization'] = 'Bearer ' + sysImports.auth.oauth.access_token


  options.headers = headers;


  // handle posts
  if (/^post$/i.test(options.method)) {
	  // convert query string to post vars
	var formData = {};
	if (imports.body) {
		if ($resource.helper.isObject(imports.body)) {
			formData = imports.body;
		} else {
			formData = qs.parse(imports.body);
		}
	 } else {
		 formData = imports;
	 }

	if (imports.post_files && $resource.helper.isTruthy(imports.post_files) && contentParts && contentParts._files) {
		 struct.multipart = contentParts._files;
	 } else {
		 struct.multipart = [];
     }

	 options.formData = formData;
	 if (struct.multipart.length) {
	    var putFiles = []
		for (var f = 0; f < struct.multipart.length; f++) {
			(function(f) {
			  $resource.file.get(struct.multipart[f], function(err, fileStruct, readStream) {
				  if (err) {
				    next(err);
				  } else {
					 putFiles.push(
						  {value : readStream,
			    		     options: {
			    		      filename: fileStruct.name,
			    		      contentType: fileStruct.type
			    		    }
						  });
			    	}
			    if(f === struct.multipart.length -1) {
			    	  formData[(imports.file_name) ? imports.file_name : "file"] = putFiles;
					  options.formData = formData;
					  var req = scriptrRequest(options, $resource, channel, contentParts, self.pod, next);
			    }
		   	}); })(f);
		  }
	 } else {
		 var req = scriptrRequest(options, $resource, channel, contentParts, self.pod, next);
	 }
} else {
    if (imports.query_string) {
      if ($resource.helper.isObject(imports.query_string)) {
        options.qs = imports.query_string;
      } else {
        options.qs = qs.parse(imports.query_string);
      }
    }
    var req = scriptrRequest(options, $resource, channel, contentParts, self.pod, next);
  }
}

// -----------------------------------------------------------------------------
module.exports = RunScript;
