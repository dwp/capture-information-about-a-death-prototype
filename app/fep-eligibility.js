const differenceInMonths = require('date-fns/difference_in_months')
const differenceInYears = require('date-fns/difference_in_years');
const { checkRelationship } = require('./eligibility-utils.js');

/**
 * Takes in 3 values from the given funeral date and returns the difference in months between todays date
 * @param {string} year
 * @param {string} month
 * @param {string} day
 */
const validateFuneralDate = (year, month, day) => {
  const parsedMonth = parseInt(month) - 1;
  const parsedDay = parseInt(day);
  const date = new Date();
  const formattedDay = date.getDate() === parsedDay ? parsedDay + 1 : parsedDay; // This means if they claim on the 6th, it will class the 6 as the 5th month

  return differenceInMonths(date, new Date(year, parsedMonth, formattedDay));
}

const fepRelationships = ['girlfriend', 'boyfriend', 'partner', 'wife', 'husband', 'civilpartner'];

const isClaimantAdult = (age = 0) => !(age <= 19 && age >= 16);

const getClaimantAge = (data) => {
  const callerDob = new Date(data['deceased-dob-year'], data['deceased-dob-month'], data['deceased-dob-day']);
  return differenceInYears(new Date(), callerDob);
};

const isCallerSpouse = ((data) => data['is-caller-spouse'] === 'true');

/**
 * Takes data from Death notification and calculates whether they can proceed with FEP
 * @param {object} data
 */
const isEligibleForFep = (data) => {
  getClaimantAge(data)
  console.log('check relationship', checkRelationship('girl friend', fepRelationships))
  return true;
};

const mockResponse = () => {
  const valid = {
    isEligible: true,
    funeralDate: {
      isEligible: true
    },
    funeralResidency: {
      isEligible: true
    }
  };

  const error = {
    isEligible: false,
    funeralDate: {
      isEligible: true
    },
    funeralResidency: {
      isEligible: false,
      error: 'error_fep_funeral_residency',
      message: 'the funeral must be within the UK'
    }
  };
};

const isEligible = response => response.find(item => !item.isEligible);

module.exports = {
  validateFuneralDate,
  isEligibleForFep,
  isClaimantAdult,
  getClaimantAge,
  isCallerSpouse
};