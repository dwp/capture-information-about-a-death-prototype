const errors = require('../utils/errors');
const relationships = ['wife', 'husband'];

module.exports = [
  {
    type: 'input',
    name: 'caller-name',
    message: "What's your name?",
  },
  {
    type: 'input',
    name: 'phone',
    message: "What's your phone number?",
  },
  {
    type: 'input',
    name: 'caller_age',
    message: "How old are you?",
    validate: (val) => {
      if (65 > val) {
        errors.generateError('age', 'bsp');
      } else {
        errors.bspEligibility.push({ eligible: true, reason: 'age' });
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
        errors.bspEligibility.push({ eligible: true, reason: 'relationship' });
      } else {
        errors.generateError('relationship', 'bsp');
      }

      return true;
    },
  },
];