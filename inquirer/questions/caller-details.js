const errors = require('../utils/errors');
const relationships = ['wife', 'husband'];

module.exports = [
  // {
  //   type: 'input',
  //   name: 'caller-name',
  //   message: "What's your name?",
  // },
  // {
  //   type: 'input',
  //   name: 'phone',
  //   message: "What's your phone number?",
  // },
    // see if theres any kids for BSP eligibility...
  {
    type: 'input',
    name: 'caller_age',
    message: "How old are you?",
    validate: (val) => {
      if (65 < val) {
        errors.generateError('age', 'bsp');
      } else {
        errors.generateSuccess('age', 'bsp');
      }
      return true;
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

/**
 * qualifying benefits? list of
 *
 */