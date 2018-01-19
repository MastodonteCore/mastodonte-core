Mastodonte.js Core
=======================

[![Dependency Status](https://david-dm.org/mastodontejs/mastodonte-core.svg?style=flat)](https://david-dm.org/mastodontejs/mastodonte-core)
[![Build Status](https://travis-ci.org/mastodontejs/core.svg?branch=master)](https://travis-ci.org/mastodontejs/core)

A boilerplate for **Node.js** web applications.

Table of Contents
-----------------

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works-mini-guides)
- [Contributing](#contributing)
- [License](#license)

Features
--------

- Accept microservices
- Parameters accessible in all app even for each microservice
- Flash notifications
- `body-parser` include by default
- Gzip responses
- SSL (optional)
- WebSocket server (optional)
- Node.js clusters support
- CSRF protection

Prerequisites
-------------

- [MongoDB](https://www.mongodb.org/downloads)
- [Node.js 7.0+](http://nodejs.org)
- Command Line Tools
 - <img src="http://deluge-torrent.org/images/apple-logo.gif" height="17">&nbsp;**Mac OS X:** [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) (or **OS X 10.9+**: `xcode-select --install`)
 - <img src="http://dc942d419843af05523b-ff74ae13537a01be6cfec5927837dcfe.r14.cf1.rackcdn.com/wp-content/uploads/windows-8-50x50.jpg" height="17">&nbsp;**Windows:** [Visual Studio](https://www.visualstudio.com/products/visual-studio-community-vs)
 - <img src="https://lh5.googleusercontent.com/-2YS1ceHWyys/AAAAAAAAAAI/AAAAAAAAAAc/0LCb_tsTvmU/s46-c-k/photo.jpg" height="17">&nbsp;**Ubuntu** / <img src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_Linux_Mint.png" height="17">&nbsp;**Linux Mint:** `sudo apt-get install build-essential`
 - <img src="http://i1-news.softpedia-static.com/images/extra/LINUX/small/slw218news1.png" height="17">&nbsp;**Fedora**: `sudo dnf groupinstall "Development Tools"`
 - <img src="https://en.opensuse.org/images/b/be/Logo-geeko_head.png" height="17">&nbsp;**OpenSUSE:** `sudo zypper install --type pattern devel_basis`


Getting Started
---------------

```bash
# Install and save in your node project
npm i -S @mastodonte/core
```

How It Works 
------------

In your node file server
```javascript
const Core = require('@mastodonte/core')
// Init with settings
const core = new Core({
  host: '0.0.0.0',
  port: 8000,
  mongodb: 'mongodb://localhost:27017/test',
  session: 'Your Session Secret goes here',
  viewEngine: 'html',
  views: 'views'
})

// Add some methods accessible in all application (optional)
core.addService('stringify', (arg) => JSON.stringify(arg))

// Add some routes
core.addRoute('get', '/', (req, res) => res.send('Hello').end())

// Add your microservices
const account = require('@mastodonte/account')
core.add('account', account)

// Run server
core.run()
```


Contributing
------------

If something is unclear, confusing, or needs to be refactored, please let me know.
Pull requests are always welcome. Please open an issue before
submitting a pull request.

License
-------

The MIT License (MIT)

Copyright (c) 2014-2017 Olivier Monnier

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
