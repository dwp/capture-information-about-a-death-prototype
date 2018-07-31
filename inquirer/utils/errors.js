const gutil = require('gulp-util');
const c = gutil.colors;
const eligibility = require('./eligibility');
const illegibleBsp = (reason => `The caller is not eligible for BSP due to ${reason}`);
const illegibleFep = (reason => `The caller is not eligible for FEP due to ${reason}`);

const generateError = (reason, benefit = 'fep') => {
  let benefitType = illegibleFep;
  let benefitEffors = eligibility.fep;
  if (benefit === 'bsp') {
    benefitType = illegibleBsp;
    benefitEffors = eligibility.bsp;
  }
  console.info('\n' + c.bgRed(benefitType(reason)));
  benefitEffors.push({ eligible: false, reason });
}

const generateSuccess = (reason, benefit = 'fep') => {
  let benefitType = eligibility.fep;
  if (benefit === 'bsp') {
    benefitType =  eligibility.bsp;
  }
  benefitType.push({ eligible: true, reason });
}

module.exports = { generateError, generateSuccess };