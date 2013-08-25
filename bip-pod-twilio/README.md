![Twilio](twilio.png) bip-pod-twilio
=======

[Twilio](https://www.twilio.com/) pod for [bipio](https://bip.io).  

## Installation

From bipio server root directory

    npm install bip-pod-twilio
    ./tools/pod-install.js -a twilio [-u optional account-wide channel auto install]

The pod-install script is a server script which will register the pod with the bipio server and add sparse
configuration to your NODE_ENV environment config ('default.json', staging or production)
keyed to 'twilio', based on the default config in the pod constructor.  It will also move the
pod icon into the server cdn

Manually restart the bipio server at your convenience.

## Actions

### send_sms

Sends a new outgoing SMS Message. If you are sending SMS while your Twilio 
account is in Trial mode, the "To" phone number must be verified with Twilio.

Sample Channel Config :

```
"action" : "twilio.send_sms",
"config": {
  "body": "Default Text body, Pretty boring!",
  "to_phone" : "+1234567890",
  "from_phone" : "+0987654321"
}
```

[Bipio Docs](https://bip.io/docs/pods/twilio)

## License

BipIO is free for non-commercial use - [GPLv3](http://www.gnu.org/copyleft/gpl.html)

Our open source license is the appropriate option if you are creating an open source application under a license compatible with the GNU GPL license v3. 

Bipio may not be used for Commercial purposes by an entity who has not secured a Bipio Commercial OEM License.  To secure a Commercial OEM License for Bipio,
please [reach us](mailto:enquiries@cloudspark.com.au)

![Cloud Spark](http://www.cloudspark.com.au/cdn/static/img/cs_logo.png "Cloud Spark - Rapid Web Stacks Built Beautifully")
Copyright (c) 2010-2013  [CloudSpark pty ltd](http://www.cloudspark.com.au)