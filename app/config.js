const t = require('./filters.js')().translate;
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
  // assetsMaxAge: 10000,
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
  },
  // fake ninos for testing
  duplicateNinos: [
    'ZK538099C',
    'CZ116319A',
    'OC172390C'
  ],
  skipStartPageValidation: false,
  qualifyingBenefits: [
    {
      value: "attendance_allowance",
      text: t("attendance_allowance"),
      hospitalInterest: true
    },
    {
      value: "bereavement_benefits",
      text: t("bereavement_benefits")
    },
    {
      value: "bsp",
      text: t("bsp")
    },
    {
      value: "carers_allowance",
      text: t("carers_allowance"),
      hospitalInterest: true
    },
    {
      value: "disability_living_allowance_65",
      text: t("disability_living_allowance_65"),
      hospitalInterest: true
    },
    {
      value: "disability_living_allowance_child",
      text: t("disability_living_allowance_child")
    },
    {
      value: "disability_living_allowance_working_age",
      text: t("disability_living_allowance_working_age"),
      hospitalInterest: true
    },
    {
      value: "esa",
      text: t("esa"),
      hospitalInterest: true
    },
    {
      value: "incapacity_benefit",
      text: t("incapacity_benefit")
    },
    {
      value: "income_support",
      text: t("income_support"),
      hospitalInterest: true
    },
    {
      value: "industrial_injury_disablement_allowances",
      text: t("industrial_injury_disablement_allowances"),
      hospitalInterest: true
    },
    {
      value: "jsa",
      text: t("jsa")
    },
    {
      value: "maternity_allowance",
      text: t("maternity_allowance")
    },
    {
      value: "pip",
      text: t("pip"),
      hospitalInterest: true
    },
    {
      value: "severe_disablement_allowance",
      text: t("severe_disablement_allowance")
    },
    {
      value: "universal_credit",
      text: t("universal_credit")
    },
    {
      value: "widowed_parent_allowance",
      text: t("widowed_parent_allowance")
    }
  ]
}
