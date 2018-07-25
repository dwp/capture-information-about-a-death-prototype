const gutil = require('gulp-util');
const c = gutil.colors;
const bsp = [];
const sffp = [];
const checkEligibility = type => type.filter(item => !item.eligible)
const gatherReasons = type => type.map(item => item.reason).join('\n');
const isEligibleBsp = () => gatherReasons(checkEligibility(bsp));
const isEligibleSffp = () => gatherReasons(checkEligibility(sffp));

const listReasons = (reasons, type) => {
  if (reasons().length) {
    console.info(c.bold.bgRed('\nThe caller is not eligible for ' + type + ' due to the following reasons' +
    '\n ' + reasons()));
  } else {
    console.info(c.bold.bgGreen('\nThe caller is eligible for ' + type));
  }
}
const logEligibility = () => {
  console.info(c.bold.inverse('\nEligibility check complete'));
  listReasons(isEligibleBsp, 'BSP');
  listReasons(isEligibleSffp, 'SFFP');
  process.exit(0)
}
module.exports = { bsp, sffp, isEligibleBsp, isEligibleSffp, logEligibility }