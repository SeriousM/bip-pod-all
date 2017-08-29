/**
 *
 * The Bipio Email Pod.  smtp_forward action definition
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
var nodemailer = require('nodemailer'),
  smtpTransport;

/*
 * --------------------------------------------------------------- smtp_forward
 *
 * Actions relays email outbound
 *
 */
function EmailMe(podConfig, self) {

  // use the global email pod config
  this.podConfig = podConfig = self.getDao().pod('email').getConfig();


  smtpTransport = nodemailer.createTransport(podConfig.strategy || "smtp", podConfig.mailer);

  if (podConfig.dkim && podConfig.dkim.selector && podConfig.dkim.key_path) {
    fs.readFile(podConfig.dkim.key_path, function(err, contents) {
      if (err) {
        app.logmessage('Email Pod DKIM pem unreadable at ' + podConfig.dkim.key_path + '[' + err + ']');
      } else {
        smtpTransport.useDKIM({
          keySelector : podConfig.dkim.selector,
          privateKey : contents,
          domainName : CFG.domain_public
        });
      }
    });
  }
}

EmailMe.prototype = {};

function sendMail(transport, mailOptions, next) {
  transport.sendMail(mailOptions, function(error, response){
    var exports = {
      'response_message' : ''
    };

    exports.response_message = (error) ? error.message : response.message;

    next(error, exports);
  });
}

/**
 * Invokes (runs) the action.
 *
 */
EmailMe.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var log = this.$resource.log,
    $resource = this.$resource,
    podConfig = this.podConfig,
    body = "",
    nowMS = process.hrtime().join(''),
    from = podConfig.reply_to || podConfig.sender;

  // get account default email
  $resource.dao.find(
    'account',
    {
      id : channel.owner_id
    },
    function(err, account) {
      if (err) {
        next(err);
      } else if (!account || account && !account.email_account) {
        next('No Email Address Available For Account ' + account.username);
      } else {
        var mailOptions = {
          'envelope' : {
            'from' : from,
            'sender' : from,
            'to' : account.email_account
          },
          'from' : from,
          'to' : account.email_account,
          'subject' : imports.subject,
          'html' : imports.body_html,
          'generateTextFromHTML' : true,
          'attachments' : []
        },
        promises = [],
        deferred;

        if (sysImports.client && sysImports.client.id && mailOptions.from) {
          // try to match the domain portion of reply_to
          // even if 'sender <foo@bar.baz>' format
          var mailFrom = mailOptions.from.toString().match(/@[a-zA-Z.-0-9]*/);
          if (mailFrom) {
            replyHost = mailFrom.shift();

            if (replyHost) {
              mailOptions.messageId =
                sysImports.client.id
                  + '-'
                  + nowMS
                  + replyHost;
            }
          }
        }

        if (imports.body_text) {
          mailOptions.text = imports.body_text;
        }

        if (contentParts && contentParts._files && contentParts._files.length > 0) {
          for (var i = 0; i < contentParts._files.length; i++) {
            deferred = Q.defer();
            promises.push(deferred.promise);

            (function(attachments, fileStruct, deferred) {
              $resource.file.get(fileStruct, function(err, fileStruct, stream) {
                if (err) {
                  deferred.reject(err);
                } else {
                  attachments.push({
                    fileName : fileStruct.name,
                    streamSource: stream
                  });
                  deferred.resolve();
                }
              });
            })(mailOptions.attachments, contentParts._files[i], deferred);
          }
        }

        // extract parts
        if (undefined != imports.parts && imports.parts.length > 0) {
          var partLen = imports.parts.length, p = imports.parts, b;
          for (var i = 0; i < partLen; i++) {
            b = p[i].body;
            if (p[i].content_type == 'text/plain') {
              mailOptions.text = b;
            } else if (p[i].content_type == 'text/html') {
              mailOptions.html = b;
            }
          }
        }

        if (promises.length) {
          Q.all(promises).then(
            function() {
              sendMail(smtpTransport, mailOptions, next);
            },
            function(err) {
              next(err);
            });
        } else {
          sendMail(smtpTransport, mailOptions, next);
        }

      }
    }
  )
}

// -----------------------------------------------------------------------------
module.exports = EmailMe;