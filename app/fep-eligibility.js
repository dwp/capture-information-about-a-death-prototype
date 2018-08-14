var differenceInMonths = require('date-fns/difference_in_months')
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

/**
 * Takes data from Death notification and calculates whether they can proceed with FEP
 * @param {object} data
 */
const isEligibleForFep = (data) => {
  const relationship = data['caller-relationship'] || '';
  const parsedRelationship = relationship.toLowerCase().replace(/(\s)|(-)/g, '').trim();
  const isCouple = fepRelationships.includes(parsedRelationship);
  return isCouple;
};

module.exports = {
  validateFuneralDate,
  isEligibleForFep
}