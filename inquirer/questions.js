const callerDetails = require('./questions/caller-details');
const errors = require('./utils/errors');
const gutil = require('gulp-util');
const c = gutil.colors;


/**
 * The aim is to kill the journey as quick as possible, so that the user
 * doesn't have to answer any questions they don't need to. Ask questions that
 * will determine whether they are eligible sooner, rather than later to save them time.
 * Asking explicitlly for age because datetime plugin doesn't support validation
 */
const questions = [
  ...callerDetails,
  {
    type: 'confirm',
    name: 'accepted_costs',
    message: "Has the claimant or partner accepted responsibility for the funeral costs?",
  },
  {
    type: 'confirm',
    name: 'caller_partner',
    message: 'are you partner at dod',
    when: (val) => {
      // The claimant or partner has accepted responsibility, so ask
      if (val.accepted_costs) {
        return true;
      }

      errors.generateError('responsibility')
      process.exit(0);
      return false;
    }
  },
  {
    type: 'confirm',
    name: 'deceased_partner',
    message: 'at dod did deceased have a partner',
    when: (val) => {
      // Ask this if the caller isn't the partner
      if (val.caller_partner) {
        return false;
      }

      return true;
    }
  },
  {
    type: 'confirm',
    name: 'no_partner',
    message: 'Claim failed due to no partner',
    when: (val) => {
      if (val.deceased_partner || val.caller_partner) {
        return false;
      }

      errors.generateError('no_partner')
      process.exit(0)

      return false;
    }
  }
];

module.exports = { questions };