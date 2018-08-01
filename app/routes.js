const express = require('express')
const router = express.Router()
const config = require('./config.js')
const fs = require('fs');

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// move this
const validateProps = (props, data) => props.filter(prop => !data[prop]);


const checkDapEligibility = (data => data['deceased-qualifying-benefits'] ? data['deceased-qualifying-benefits'].length : false);

const getVersion = ((url, index = 0) => url.slice(1).split('/')[index]);

router.get('*/versions*', (req, res, next) => {
  res.locals.version = getVersion(req.params[1]);
  next();
});

router.get('*/check', (req, res, next) => {
  const isDap = checkDapEligibility(req.session.data);
  const dapProps = ['dap-bank-or-building', 'dap-bank-name', 'dap-bank-account-no', 'dap-bank-sort-code'];
  const isDapComplete = validateProps(dapProps, req.session.data).length === 0;
  console.log(isDapComplete)
  if (isDap && !isDapComplete) {
    res.redirect(req.params[0] + '/death-arrears.html');
    res.locals.isDapComplete = true;
  }
  next();
})

router.get('*/payee', (req, res, next) => {
  res.locals.isCallerDap = req.session.data['death-arrears-caller'] === 'true';
  next();
});

const handleMissingVersionRoute = (version, route, res) => {
  const fileExists = fs.existsSync(`app/views/${route}`);
  let renderedRoute = route;
  if (!fileExists) {
    renderedRoute = route.replace(version, 'base');
  }
  return res.render(`${renderedRoute.slice(1)}`)
};


module.exports = router
