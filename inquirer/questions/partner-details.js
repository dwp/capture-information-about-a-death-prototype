const errors = require('../utils/errors');
const eligiblity = require('../utils/eligibility');

module.exports = [
  {
    type: 'checkbox',
    name: 'eligible_benefits',
    message: 'Do you get or have pending any of the following benefits? (copys bad)',
    choices: [
      'Income Support',
      'income-based Jobseeker’s Allowance',
      'income-related Employment and Support Allowance',
      'Pension Credit',
      'Housing Benefit',
      'The disability or severe disability element of Working Tax Credit',
      'Child Tax Credit',
      'Universal Credit',
      'Support for Mortgage Interest loan'
    ]
  },
  {
    type: 'confirm',
    name: 'accepted_costs',
    message: "Has the claimant or partner accepted responsibility for the funeral costs?",
    when: (val) => {
      // There has been benefits selected from the list
      if (val.eligible_benefits.length) {
        errors.generateSuccess('qualifying_benefits');
        return true;
      }
      errors.generateError('qualifying_benefits');
      eligiblity.logEligibility();
      return false;
    }
  },
  {
    type: 'confirm',
    name: 'caller_partner',
    message: 'are you partner at dod',
    when: (val) => {
      // the caller has already said theyre the husband or wife earlier, so dont bother asking
      if (['wife', 'husband'].includes(val.caller_relationship)) {
        return false;
      }

      // The claimant or partner has accepted responsibility, so ask
      if (val.accepted_costs) {
        return true;
      }

      errors.generateError('responsibility')
      eligiblity.logEligibility();
      return false;
    }
  },
  {
    type: 'confirm',
    name: 'deceased_partner',
    message: 'at dod did deceased have a partner',
    when: (val) => {
      // the caller has already said theyre the husband or wife earlier, so dont bother asking
      if (['wife', 'husband'].includes(val.caller_relationship)) {
        return false;
      }
      // Ask this if the caller isn't the partner
      if (val.caller_partner) {
        return false;
      }

      return true;
    }
  },
  {
    type: 'confirm',
    name: 'not_partner',
    message: 'Claim failed as caller is not surviving partner',
    when: (val) => {
      // Ask this if there is a partner, but the caller is not the partner
      if (val.deceased_partner && !val.caller_partner) {
        errors.generateError('not_surviving_partner')
        eligiblity.logEligibility();
      }
      return false;
    }
  },
  {
    type: 'confirm',
    name: 'no_partner',
    message: 'Claim failed due to no partner',
    when: (val) => {
      if (['wife', 'husband'].includes(val.caller_relationship) || val.deceased_partner || val.caller_partner) {
        return false;
      }

      errors.generateError('no_partner')
      eligiblity.logEligibility();

      return false;
    }
  },
  {
    type: 'confirm',
    name: 'date_of_death',
    message: 'Did the deceased die in the last 6 months?',
  },
  {
    type: 'confirm',
    name: 'date_of_death_failed',
    message: 'The deceased died longer than 6 months ago',
    when: val => {
      if (!val.date_of_death) {
        errors.generateError('date_of_death')
        eligiblity.logEligibility();
      }
      return false;
    }
  },
  {
    type: 'confirm',
    name: 'resident_of_uk',
    message: 'Was the deceased a resident of the UK?'
  },
  {
    type: 'confirm',
    name: 'not-resident-of-uk',
    message: 'The deceased is not a resident of the uk',
    when: (val) => {
      if (!val.resident_of_uk) {
        errors.generateError('not_uk_resident')
        eligiblity.logEligibility();
      }
      return false;
    }
  }
];
