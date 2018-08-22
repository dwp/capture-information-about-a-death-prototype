// Use this file to change prototype configuration.

// Note: prototype config can be overridden using environment variables (eg on heroku)

module.exports = {
  // Service name used in header. Eg: 'Renew your passport'
  serviceName: 'Funeral Expenses Payment',

  // Default port that prototype runs on
  port: '3000',

  // Enable or disable password protection on production
  useAuth: 'true',

  // Automatically stores form data, and send to all views
  useAutoStoreData: 'true',

  // Enable or disable built-in docs and examples.
  useDocumentation: 'true',

  // Force HTTP to redirect to HTTPS on production
  useHttps: 'true',

  // Cookie warning - update link to service's cookie page.
  cookieText: 'GOV.UK uses cookies to make the site simpler. <a href="#">Find out more about cookies</a>',

  // Enable or disable Browser Sync
  useBrowserSync: 'true',

  addresses: {
    'ne981yx': {
      line1: 'Benton Park View',
      line2: '',
      town: 'Newcastle Upon Tyne',
      county: 'Tyne and Wear',
      postcode: 'NE98 1YX',
      summary: 'Benton Park View, Newcastle Upon Tyne, NE98 1YX'
    },
    'ne463jr': {
      line1: '2 Windsor Terrace',
      line2: '',
      town: 'Hexham',
      county: 'Northumberland',
      postcode: 'NE46 3JR',
      summary: '2 Windsor Terrace, Hexham, NE46 3JR'
    }
  }
}
