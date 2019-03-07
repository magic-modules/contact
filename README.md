## @magic-modules/pre

a Contact Form for [@magic](https://magic.github.io/core)
also includes a server lambda that sends emails via smtp

[demo](https://magic-modules.github.io/contact)

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