![coindesk](coindesk.png) bip-pod-coindesk
=======

<a href="http://www.coindesk.com/price/">CoinDesk</a> Pod for [bipio](https://bip.io).

## Installation

This pod requires BipIO 0.2.68 or above

From bipio server root directory

    npm install bip-pod-coindesk
    ./tools/pod-install.js -a coindesk [-u optional account-wide channel auto install]

The pod-install script is a server script which will register the pod with the bipio server and add sparse
configuration to your NODE_ENV environment config ('default.json', staging or production)
keyed to 'coindesk', based on the default config in the pod constructor.  It will also move the
pod icon into the server cdn

Manually restart the bipio server at your convenience.

[Bipio Docs](https://bip.io/docs/pods/coindesk)

## License

BipIO is free for non-commercial use - [GPLv3](http://www.gnu.org/copyleft/gpl.html)

Our open source license is the appropriate option if you are creating an open source application under a license compatible with the GNU GPL license v3.

If you'd like to integrate BipIO with your proprietary system, GPLv3 is likely incompatible.  To secure a Commercial OEM License for Bipio,
please [reach us](mailto:hello@bip.io)


Copyright (c) 2010-2014 [WoT.IO Inc](http://wot.io)
