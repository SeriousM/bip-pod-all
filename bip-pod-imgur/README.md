![Imgur](imgur.png) bip-pod-imgur
=======

[Imgur API](http://api.imgur.com/) pod for [bipio](https://bip.io).  

## Installation

From bipio server root directory

    npm install bip-pod-imgur
    ./tools/pod-install.js -a imgur [-u optional account-wide channel auto install]

The pod-install script is a server script which will register the pod with the bipio server and add sparse
configuration to your NODE_ENV environment config ('default.json', staging or production)
keyed to 'imgur', based on the default config in the pod constructor.  It will also move the
pod icon into the server cdn

Manually restart the bipio server at your convenience.

## Actions

### image_upload_anon

Upload an image to Imgur Anonymously (meaning, not tied to your account)

Sample Channel Config :

```
"action" : "imgur.image_upload_anon",
```

[Bipio Docs](https://bip.io/docs/pods/imgur)

## License

BipIO is free for non-commercial use - [GPLv3](http://www.gnu.org/copyleft/gpl.html)

Our open source license is the appropriate option if you are creating an open source application under a license compatible with the GNU GPL license v3. 

Bipio may not be used for Commercial purposes by an entity who has not secured a Bipio Commercial OEM License.  To secure a Commercial OEM License for Bipio,
please [reach us](mailto:enquiries@cloudspark.com.au)

![Cloud Spark](http://www.cloudspark.com.au/cdn/static/img/cs_logo.png "Cloud Spark - Rapid Web Stacks Built Beautifully")
Copyright (c) 2010-2013  [CloudSpark pty ltd](http://www.cloudspark.com.au)