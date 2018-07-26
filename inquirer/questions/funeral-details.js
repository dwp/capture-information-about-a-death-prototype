const errors = require('../utils/errors');
const eligiblity = require('../utils/eligibility');

module.exports = [
  {
    type: 'confirm',
    name: 'caller_paying_funeral',
    message: 'Are you paying for the funeral?',
  },
  {
    type: 'confirm',
    name: 'bond_paying_funeral',
    message: 'Is the funeral paid for by funeral bonds/plan? (copys bad)',
    when: (val) => {
      // Caller is not paying for the funeral, ask if bonds/plan are
      if (val.caller_paying_funeral) {
        return false;
      }

      return true;
    }
  },
  {
    type: 'confirm',
    name: 'no_payment',
    message: 'The caller is not paying for the funeral, nor is a bond',
    when: (val) => {
      // the caller isnt paying for the funeral with their money or a bond
      if (!val.caller_paying_funeral && !val.bond_paying_funeral) {
        errors.generateError('no_payment');
        eligiblity.logEligibility();
      }

      return false;
    }
  },
  {
    type: 'confirm',
    name: 'funeral_uk',
    message: 'Is the funeral in the UK?',
    when: (val) => {
      // Caller is paying for the funeral, let's ask more
      if (val.caller_paying_funeral || val.bond_paying_funeral) {
        return true;
      }

      return false;
    }
  },
  {
    type: 'confirm',
    name: 'funeral_not_uk',
    message: 'The funeral is not in the UK',
    when: (val) => {
      // the funeral isn't in the UK
      if (!val.funeral_uk) {
        errors.generateError('funeral_location');
        eligiblity.logEligibility();
      }
      return false;
    }
  }
];