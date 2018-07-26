const errors = require('../utils/errors');
const eligiblity = require('../utils/eligibility');
const relationships = ['wife', 'husband'];

module.exports = [
  {
    type: 'input',
    name: 'caller_age',
    message: "How old are you?",
    validate: (val) => {
      // Caller too old for BSP
      if (65 < val) {
        errors.generateError('age', 'bsp');
        // Caller over 16 so is eligible, but need to check on BSP age...
      } else if (16 < val) {
        errors.generateSuccess('age', 'bsp');
      } else {
        // They're under 16, so not eligible for anything
        errors.generateError('age', 'bsp');
      }
      return true;
    }
  },
  {
    type: 'confirm',
    name: 'caller_education',
    message: 'Are you in full time, non-advanced education or training?',
    when: (val) => {
      // if the caller is 16-19 check they aren't in education
      if (val.caller_age >= 16 && val.caller_age <= 19) {
        return true;
      }

      if (val.caller_age <= 16) {
        errors.generateError('age');
        errors.generateError('age', 'bsp');
        eligiblity.logEligibility();
      }

      return false;
    }
  },
  {
    type: 'confirm',
    name: 'caller_education_failed',
    message: 'Failed due to age',
    when: (val) => {
      // If theyre in education, fail
      if (val.caller_education) {
        errors.generateError('age');
        eligiblity.logEligibility();
        return false;
      }

      return false;
    }
  },
  {
    type: 'input',
    name: 'caller_relationship',
    message: "What was your relationship to the deceased?",
    validate: (val) => {
      if (relationships.includes(val)) {
        errors.generateSuccess('relationship', 'bsp');
      } else {
        errors.generateError('relationship', 'bsp');
      }

      return true;
    },
  },
  {
    type: 'confirm',
    name: 'caller_children',
    message: 'Did you and the deceased have any dependants/children',
    when: (val) => {
      if (relationships.includes(val.caller_relationship)) {
        return true;
      }

      return false;
    }
  },
  {
    type: 'confirm',
    name: 'caller_children',
    message: 'Did you and the deceased have any dependants/children',
    when: (val) => {
      if (val.caller_children) {
        errors.generateSuccess('children', 'bsp');
      }

      return false;
    }
  }
];