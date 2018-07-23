const gutil = require('gulp-util');
const c = gutil.colors;
const bspEligibility = [];
const sffpEligibility = [];
const illegibleBsp = (reason => `The caller is not eligible for BSP due to ${reason}`);
const illegibleSffp = (reason => `The caller is not eligible for SFFP due to ${reason}`);

const generateError = (reason, benefit = 'sffp') => {
  let benefitType = illegibleSffp;
  let benefitEffors = sffpEligibility;
  if (benefit === 'bsp') {
    benefitType = illegibleBsp;
    benefitEffors = bspEligibility;
  }
  console.info('\n' + c.bgRed(benefitType(reason)));
  benefitEffors.push({ eligible: false, reason });
}

const generateSuccess = (reason, benefit = 'sffp') => {
  let benefitType = sffpEligibility;
  if (benefit === 'bsp') {
    benefitType = bspEligibility;
  }
  benefitType.push({ eligible: true, reason });
}

module.exports = { generateError, generateSuccess, sffpEligibility, bspEligibility };