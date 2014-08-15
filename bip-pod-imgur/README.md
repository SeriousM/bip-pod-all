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

## Documentation

[Bipio Docs](https://bip.io/docs/pods/imgur)

## License

BipIO is free for non-commercial use - [GPLv3](http://www.gnu.org/copyleft/gpl.html)

If you'd like to integrate BipIO with your proprietary system, GPLv3 is likely incompatible. To secure a Commercial OEM License for Bipio, please [reach us](mailto:support.bip.io)

Copyright (c) 2010-2013  [Michael Pearson](https://github.com/mjpearson)
