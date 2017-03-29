![Scriptr](scriptr.png) bip-pod-scriptr
=======

[Scriptr](https://www.scriptr.io/) pod for [bipio](https://bip.io).

## Installation

From bipio server root directory

    npm install bip-pod-scriptr
    ./tools/pod-install.js -a scriptr [-u optional account-wide channel auto install]

The pod-install script is a server script which will register the pod with the bipio server and add sparse
configuration to your NODE_ENV environment config ('default.json', staging or production)
keyed to 'scriptr', based on the default config in the pod constructor.  It will also move the
pod icon into the server cdn

Manually restart the bipio server at your convenience.

## Provisioning

Clusters using Scriptr must be provisioned manually with Scriptr.  To provision, send an email to `dev@scriptr.io` with the following info

* App Name: <application name>

* Description: <application description>

* Website: <BipIo Cluster URL>

* CallBack URL: <default callback after authorization>. eg: `http://api.bipio.demos.wot.io/rpc/oauth/scriptr/cb` -- take care to use the correct cluster hostname.

* Image Path: <logo_url_path>

## Docs

[Bipio Docs](https://bipio.cloud.wot.io/docs/pods/scriptr)

## License

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.


Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
