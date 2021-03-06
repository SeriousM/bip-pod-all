/**
 *
 * The Bipio Facebook Pod.  get_timeline_link action definition
 * ---------------------------------------------------------------
 *  Gets a users facebook timeline Link
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
var url = require('url');

function GetTimelineLink() {}

GetTimelineLink.prototype = {};

GetTimelineLink.prototype.setup = function(channel, accountInfo, next) {
  this.pod.trackingStart(channel, accountInfo, true, next);
}

GetTimelineLink.prototype.teardown = function(channel, accountInfo, next) {
  this.pod.trackingRemove(channel, accountInfo, next);
}

GetTimelineLink.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod,
    self = this;

  pod.trackingGet(channel, function(err, since) {
    if (err) {
      next(err);
    } else {
      pod.trackingUpdate(channel, function(err, until) {
        if (err) {
          next(err);
        } else {
          imports.since = since;
          imports.until = until;

          self.invoke(imports, channel, sysImports, contentParts, function(err, post) {
            if (err) {
              next(err);
            } else {
              next(false, post);
            }
          });
        }
      });
    }
  });
}

/**
 * Invokes (runs) the action.
 *
 */
GetTimelineLink.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    var $resource = this.$resource,
      self = this,
      client = this.pod.getClient(sysImports);
    // get last tracking time
    var args = self.pod.initParams(sysImports);

    if (imports.since) {
       args.since = imports.since;
    }

    if (imports.until) {
    	args.until = imports.until;
    }
    
    
    client.api('/' + JSON.parse(sysImports.auth.oauth.profile).id  +'/posts', 'get', args,
        function (res) {
            var err = false;
            var forwardOk = false;
            if (res.error) {
                next(res.error, exports);
                // expired token
                if (res.error.code == 190 && res.error.error_subcode == 466) {
                    next(res.error.message);
                }
            } else {
                if (res.data.length > 0) {
                   for (var i = 0; i < res.data.length; i++) {
                	   var re = /(((((http|ftp|https|ftps):\/{2}))|(\\)|^| |[:,$%^&*()#@!])(([0-9a-z_-]+\.)+(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)(:[0-9]+)?((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(\?[0-9a-zA-Z\+\%@\/&\[\];=_-]+)?)?))\b/; 
                	    if(res.data[i].message && re.test(res.data[i].message)) {
                		   next(false, res.data[i] );
                	   }
                    }
                }
            }
        });

}

// -----------------------------------------------------------------------------
module.exports = GetTimelineLink;
