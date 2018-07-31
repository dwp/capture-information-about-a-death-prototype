const questions = require('./questions/index');
const eligiblity = require('./utils/eligibility');
const inquirer = require('inquirer');
const gutil = require('gulp-util');
const Rx = require('rxjs');
const c = gutil.colors;

console.info(c.bold.bgMagenta('\nFuneral Expense Payments:'));
inquirer.prompt(questions).then(answers => {
  eligiblity.logEligibility();
});
