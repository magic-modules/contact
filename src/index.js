const Contact = (props = {}, children = []) => (state, actions) =>
  form(
    {
      id: 'contact-form',
      onsubmit: actions.contact.submit,
      action: '/api/contact/',
      method: 'POST',
      ...props,
    },
    [
      fieldset([
        div([
          label({ for: 'from' }, 'your email'),
          state.contact.errors.includes('from') && div({ class: 'error' }, 'email is required'),
          input({
            onchange: actions.contact.change,
            type: 'email',
            name: 'from',
            value: state.contact.from,
          }),
        ]),
        div([
          label({ for: 'subject' }, 'subject'),
          state.contact.errors.includes('subject') &&
            div({ class: 'error' }, 'subject is required'),
          input({
            onchange: actions.contact.change,
            type: 'text',
            name: 'subject',
            value: state.contact.subject,
          }),
        ]),
        div([
          label({ for: 'text' }, 'text'),
          state.contact.errors.includes('text') && div({ class: 'error' }, 'text is required'),
          textarea({
            onchange: actions.contact.change,
            rows: 10,
            name: 'text',
            value: state.contact.text,
          }),
        ]),
        ...children,
        div([
          state.contact.success && div({ class: 'success' }, 'email sent successfully'),
          input({ onchange: actions.contact.change, type: 'submit', value: 'send email' }),
        ]),
      ]),
    ],
  )

Contact.state = {
  from: '',
  subject: '',
  text: '',
  errors: [],
  success: false,
}

Contact.actions = {
  change: e => {
    e.preventDefault()

    const { name, value } = e.currentTarget
    return {
      [name]: value,
    }
  },

  submit: e => (_, actions) => {
    e.preventDefault()

    const form = e.target

    const inputs = form.getElementsByTagName('input')
    const textareas = form.getElementsByTagName('textarea')
    const children = [...inputs, ...textareas]

    const data = {}
    const errors = []
    children
      .filter(child => child.name)
      .forEach(child => {
        if (child.name === 'from' && !child.value.includes('@')) {
          errors.push('from')
        } else if (!child.value) {
          errors.push(child.name)
        } else {
          data[child.name] = child.value
        }
      })

    if (errors.length) {
      return {
        errors,
      }
    }

    const xhr = new XMLHttpRequest()

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          actions.sent()
        } else if (xhr.status >= 400 && xhr.status <= 599) {
          actions.onError({
            code: xhr.status,
            message: xhr.statusText,
          })
        }
      }
    }

    xhr.open('POST', form.action, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    const query = JSON.stringify(data)
    xhr.send(query)

    xhr.timeout = 5000
    xhr.ontimeout = () => {
      actions.onError({
        code: 500,
        message: 'Message could not be sent.',
      })
    }
  },

  sent: () => (_, actions) => {
    setTimeout(actions.sentDone, 3000)

    return {
      errors: [],
      success: true,
    }
  },

  sentDone: () => ({
    success: false,
  }),

  onError: error => ({
    errors: [error],
    success: false,
  }),
}

Contact.style = {
  '#contact-form': {
    width: '100%',
    border: '0 none',

    fontSize: '1em',

    fieldset: {
      margin: 0,
      padding: 0,
      border: '0 none',
    },

    'label, input, textarea, button': {
      clear: 'both',
      display: 'block',
      width: '100%',
    },
    'input, textarea': {
      padding: '0.5em 0.5em',
      margin: '0 0 0.5em',
      border: '0 none',
      borderRadius: '5px',
      backgroundColor: '#444',
      color: '#ddd',
      fontSize: '1em',
    },
    'input[type=submit]': {
      cursor: 'pointer',

      '&:hover': {
        backgroundColor: '#666',
        color: '#fff',
      },
    },
    label: {
      fontStyle: 'italic',
      fontSize: '0.9em',
    },
    textarea: {
      resize: 'vertical',
      minHeight: '100px',
    },
  },
}

Contact.server = (req, res) => {
  const mailer = require('nodemailer')

  if (!config.SMTP.TO) {
    console.log('ERROR: config.SMTP.TO is not defined, Contact will not send emails')
    return () => {}
  }

  let smtpTransport
  if (config.SMTP_TRANSPORT) {
    smtpTransport = config.SMTP_TRANSPORT
  } else if (config.SMTP) {
    if (!config.SMTP.USER) {
      console.log('ERROR: config.SMTP.USER not defined, Contact will not send emails')
      return () => {}
    }

    if (!config.SMTP.PASS) {
      console.log('ERROR: config.SMTP.PASS not defined, Contact will not send emails')
      return () => {}
    }

    smtpTransport = mailer.createTransport({
      host: config.SMTP.HOST || 'smtp.gmail.com',
      secure: true,
      auth: {
        user: config.SMTP.USER,
        pass: config.SMTP.PASS,
      },
    })
  } else {
    console.log('ERROR: no SMTP settings found, Contact will not send emails.')
    return () => {}
  }

  try {
    const { from, subject, text } = JSON.parse(req.body)

    const mail = {
      from,
      to: config.SMTP.TO,
      subject,
      text: `
Email from: ${from}

${text}`,
    }

    smtpTransport.sendMail(mail, error => {
      if (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Error sending email')
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Email sent')
      }

      smtpTransport.close()
    })
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' })
    res.end('Invalid Data')
    return
  }
}

module.exports = Contact
