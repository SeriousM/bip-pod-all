bip-pod-soundcloud
=======

Soundcloud Pod for Bipio.  

## Installation

From bipio server install directory

    npm install bip-pod-soundcloud

Auto install script will register the pod with the bipio server and add sparse
configuration to your NODE_ENV environment config ('default.json', staging or production)
keyed to 'soundcloud'.

Manually restart the bipio server at your convenience.

## Emitters

### get_favorites

Retrieves Sounds I've Favorited.  Where the 'download' config option is set on
a channel, retrieves the file and pushes it into a hub

Sample Channel Config :

```
"action" : "soundcloud.get_favorites",
"config": {
  "download": true
}
```

[Bipio Docs](https://bip.io/docs/pods/soundcloud)

## License

BipIO is free for non-commercial use - [GPLv3](http://www.gnu.org/copyleft/gpl.html)

Our open source license is the appropriate option if you are creating an open source application under a license compatible with the GNU GPL license v3. 

Bipio may not be used for Commercial purposes by an entity who has not secured a Bipio Commercial OEM License.  To secure a Commercial OEM License for Bipio,
please [reach us](mailto:enquiries@cloudspark.com.au)

![Cloud Spark](http://www.cloudspark.com.au/cdn/static/img/cs_logo.png "Cloud Spark - Rapid Web Stacks Built Beautifully")
Copyright (c) 2010-2013  [CloudSpark pty ltd](http://www.cloudspark.com.au)