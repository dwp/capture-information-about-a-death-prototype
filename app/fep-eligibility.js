const differenceInMonths = require('date-fns/difference_in_months')
const differenceInYears = require('date-fns/difference_in_years');
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

const getClaimantAge = (data) => {
  const callerDob = new Date(data['caller-dob-year'], data['caller-dob-month'], data['caller-dob-day']);
  const diff = differenceInYears(new Date(), callerDob);
  const isAdult = diff >= 16;

  // if 16 or over and 19 or under
  if (isAdult && diff <= 19) {
    console.log('ask if theyre a student');
  }
  // return isAdult;
  console.log(isAdult);
  console.log(differenceInYears(new Date(), callerDob))
  console.log(callerDob)
}

/**
 * Takes data from Death notification and calculates whether they can proceed with FEP
 * @param {object} data
 */
const isEligibleForFep = (data) => {
  // const relationship = data['caller-relationship'] || '';
  // const parsedRelationship = relationship.toLowerCase().replace(/(\s)|(-)/g, '').trim();
  // const isCouple = fepRelationships.includes(parsedRelationship);
  // return isCouple;
  getClaimantAge(data)
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
  isEligibleForFep
};