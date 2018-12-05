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
  console.log('hellotesting bsp', checkRelationship(relationship, relationships))
  return (data['is-caller-spouse'] === 'true') || checkRelationship(relationship, relationships);
};
/**
 * Takes data from the death notification and calculates if they are working age
 * @param {object} data
 */
const isWorkingAge = data => {
  const date = new Date(`${data['caller-dob-year']}-${data['caller-dob-month']}-${data['caller-dob-day']}`);
  const age = differenceInYears(new Date(), new Date(data['spouse-dob-year'], month, data['spouse-dob-day']))
  const pensionAge = !!(data['pension-age'] === 'true');
  if (!isNaN(date.getTime())) {
    const statePensionAge = sra(date, data['caller-sex']);
    return isAfter(statePensionAge.date, new Date()) || age <= 65;
  }
  return false;
};

/**
 * Takes data from Death notification and calculates whether they can proceed with BSP
 * @param {object} data
 */
const isEligibleForBsp = (data => isCallerSpouse(data) && isWorkingAge(data));

module.exports = {
  isEligibleForBsp
}