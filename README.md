## @magic-modules/contact

a Contact Form for [@magic](https://magic.github.io/core)
also includes a server lambda that sends emails via smtp

[demo](https://magic-modules.github.io/contact)

[![NPM version][npm-image]][npm-url]
[![Linux Build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]


#### install:
```bash
npm install --save-exact @magic-modules/contact
```

#### usage:

##### import:
```javascript
// assets/index.js:

const Contact = require('@magic-modules/contact')

module.exports = {
  //... other entries
  Contact,
}
```

##### config
configuration includes multiple files.

refer to the [now.sh docs](https://zeit.co/docs/v2/deployments/configuration/) for more information
```javascript
// /now.json
{
  "env": [
    "SMTP_USER",
    "SMTP_PASS"
  ]
}

// /now-required.json
{
  "SMTP_USER": "@smtp-user",
  "SMTP_PASS": "@smtp-pass",
  "SMTP_HOST": "smtp.gmail.com"
}

// /now-secrets.json
// !add file to .gitignore
{
  "@smtp-user": "your@gmail.com",
  "@smtp-pass": "password"
}
```

##### use tag
```javascript
// in any component view
const component = {
  View: () => Contact()
}
```


[npm-image]: https://img.shields.io/npm/v/@magic-modules/contact.svg
[npm-url]: https://www.npmjs.com/package/@magic-modules/contact
[travis-image]: https://api.travis-ci.org/magic-modules/contact.svg?branch=master
[travis-url]: https://travis-ci.org/magic-modules/contact
[appveyor-image]: https://img.shields.io/appveyor/ci/jaeh/contact/master.svg
[appveyor-url]: https://ci.appveyor.com/project/jaeh/contact/branch/master
[coveralls-image]: https://coveralls.io/repos/github/magic-modules/contact/badge.svg
[coveralls-url]: https://coveralls.io/github/magic-modules/contact
