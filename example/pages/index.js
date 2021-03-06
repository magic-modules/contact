module.exports = {
  View: (state, actions) =>
    div([
      h1('@magic-modules/contact'),
      p([
        'this is the ',
        Link({ to: 'https://github.com/magic-modules' }, '@magic-modules'),
        ' Contact component. It sends email using any smtp server that allows username/password authentication.',
      ]),

      GitBadges({
        travis: 'magic-modules/contact',
        npm: 'magic-modules/contact',
        greenkeeper: 'magic-modules/contact',
        appveyor: 'jaeh/contact',
        coveralls: 'magic-modules/contact',
      }),

      h2('installation'),
      Pre.View(`
npm install magic-modules/contact`),

      h2('config'),
      div('configuration includes multiple files.'),
      div([
        'refer to the ',
        Link({ to: 'https://zeit.co/docs/v2/deployments/configuration/' }, 'now.sh docs'),
        ' for more information',
      ]),
      Pre.View(`
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
  "SMTP_HOST": "smtp.mailserver.com"
}

// /now-secrets.json
// !add file to .gitignore
{
  "@smtp-user": "your@mailserver.com",
  "@smtp-pass": "password"
}
`),

      h2('usage'),
      div('first register this component'),
      Pre.View(`
// process.cwd()/assets/index.js

const Contact = require('@magic-modules/contact')

module.exports = {
  Contact,
  //... other exports
}
`),
      div('then, in a page:'),
      Pre.View(`
Contact(),
`),
      h2('example'),
      div('this is how it looks (this form has no server attached):'),
      Contact(),
    ]),
}
