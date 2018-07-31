const gutil = require('gulp-util');
const c = gutil.colors;
const bsp = [];
const fep = [];
const checkEligibility = type => type.filter(item => !item.eligible)
const gatherReasons = type => type.map(item => item.reason).join('\n');
const isEligibleBsp = () => gatherReasons(checkEligibility(bsp));
const isEligibleFep = () => gatherReasons(checkEligibility(fep));

const listReasons = (reasons, type) => {
  const benefitType = type.toUpperCase();
  if (reasons().length) {
    console.info(c.bold.bgRed('\nThe caller is not eligible for ' + benefitType + ' due to the following reasons' +
    '\n ' + reasons()));
  } else {
    console.info(c.bold.bgGreen('\nThe caller is eligible for ' + benefitType));
  }
}
const logEligibility = () => {
  console.info(c.bold.inverse('\nEligibility check complete'));
  listReasons(isEligibleBsp, 'bsp');
  listReasons(isEligibleFep, 'fep');
  process.exit(0)
}
module.exports = { bsp, fep, isEligibleBsp, isEligibleFep, logEligibility }