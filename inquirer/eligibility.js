const questions = require('./questions/index');
const eligiblity = require('./utils/eligibility');
const inquirer = require('inquirer');
const gutil = require('gulp-util');
const Rx = require('rxjs');
const c = gutil.colors;

console.info(c.bold.bgMagenta('\nSocial Funds Eligibility Checker:'));
inquirer.prompt(questions).then(answers => {
  eligiblity.logEligibility();
  // const isEligibleForBsp = checkEligibility(questions.bspEligibility);
  // const isEligibleForSffp = checkEligibility(questions.sffpEligibility);
  // // console.log(JSON.stringify(answers, null, '  '));
  // if (isEligibleForBsp.length) {
  //   console.log(c.bold.bgRed('\nThe caller is not eligible for BSP due to the following reasons' +
  //   '\n ' + gatherReasons(isEligibleForBsp)));
  // } else {
  //   console.log(c.bold.bgGreen('\nThe caller is eligible for BSP'));
  // }

  // if (isEligibleForSffp.length) {
  //   console.log(c.bold.bgRed('\nThe caller is not eligible for SFFP due to the following reasons' +
  //   '\n ' + gatherReasons(isEligibleForSffp)));
  // } else {
  //   console.log(c.bold.bgGreen('\nThe caller is eligible for SFFP'));
  // }
});
