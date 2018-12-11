const sra = require('sra');
const isAfter = require('date-fns/is_after')
const { checkRelationship } = require('./eligibility-utils.js');
const differenceInYears = require('date-fns/difference_in_years');

/**
 * Takes data from the death notification and returns their spousal status
 * @param {object} data
 */
const relationships = ['husband', 'wife', 'spouse', 'civilpartner'];
const isCallerSpouse = (data) => {
  const relationship = data['caller-relationship'];
  return (data['is-caller-spouse'] === 'true') || checkRelationship(relationship, relationships);
};
/**
 * Takes data from the death notification and calculates if they are working age
 * @param {object} data
 */
const isWorkingAge = data => {
  const month = parseInt(data['spouse-dob-month']) - 1;
  const date = new Date(`${data['spouse-dob-year']}-${data['spouse-dob-month']}-${data['spouse-dob-day']}`);
  const age = differenceInYears(new Date(), new Date(data['spouse-dob-year'], month, data['spouse-dob-day']))
  let pensionAge = false;
  if (data['pension-age'] !== 'undefined') {
    pensionAge = data['pension-age'] === 'true';
  }

  if (!isNaN(date.getTime())) {
    const statePensionAge = sra(date, data['caller-sex']);
    if (pensionAge) {
      return false;
    }
    return (age <= 65 || isAfter(statePensionAge.date, new Date()));
  }
  return false;
};

/**
 * Takes data from Death notification and calculates whether they can proceed with BSP
 * @param {object} data
 */
const isEligibleForBsp = (data => isCallerSpouse(data) && isWorkingAge(data));

module.exports = {
  isEligibleForBsp,
  isCallerSpouse,
  isWorkingAge
}