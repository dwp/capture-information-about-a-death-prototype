const express = require('express')
const router = express.Router()
const config = require('./config.js')
const fs = require('fs');
const bspRoutes = require('./routes/bsp.js');
const fepRoutes = require('./routes/fep.js');
const bspEligibility = require('./bsp-eligibility.js');
const fepEligibility = require('./fep-eligibility.js');
const utils = require('./routes/utils.js');

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

bspRoutes(router);
fepRoutes(router);

const validateProps = (props, data) => props.filter(prop => !data[prop]);

const checkDapEligibility = (data => data['deceased-qualifying-benefits'] ? data['deceased-qualifying-benefits'].length : false);

const getVersion = ((url, index = 0) => url.slice(1).split('/')[index]);

router.get('*/versions*', (req, res, next) => {
  res.locals.version = getVersion(req.params[1]);
  next();
});

const isDapAvailable = (req, res, next) => {
  const isDap = checkDapEligibility(req.session.data);
  const dapProps = ['dap-bank-or-building', 'dap-bank-name', 'dap-bank-account-no', 'dap-bank-sort-code'];
  const isDapComplete = validateProps(dapProps, req.session.data).length === 0;
  if (isDap && !isDapComplete) {
    res.redirect(req.params[0] + '/death-arrears.html');
    res.locals.isDapComplete = true;
    return true;
  }
  if (next) {
    next();
  }
  return false;
}

router.get('*/check', (req, res, next) => {
  return isDapAvailable(req, res, next);
})

router.get('*/payee', (req, res, next) => {
  res.locals.isCallerDap = req.session.data['death-arrears-caller'] === 'true';
  next();
});

router.get('*/select-eligibility', (req, res, next) => {
  isDapAvailable(req, res);

  // if BSP and FEP are complete, skip this page and go straight to check
  if (res.app.locals.bspComplete && res.app.locals.fepComplete) {
    res.redirect(req.params[0] + '/check.html');
    return;
  }

  // If either BSP or FEP isn't complete, carry on to select-eligibility
  if (!res.app.locals.bspComplete || !res.app.locals.fepComplete) {
    next();
  }
});

router.get('*/select-eligibility-cards', (req, res) => {
  const isDap = isDapAvailable(req, res);
  if (isDap) {
    return true;
  }
  res.render(req.params[0].substr(1) + '/select-eligibility-cards.html', {
    bspEligibility: utils.generateCard(req, res, 'bsp'),
    fepEligibility: utils.generateCard(req, res, 'fep')
  });
});

router.get('*/handle-eligibility', (req, res, next) => {
  const prefix = req.params[0] + '/';
  let desiredRoute = 'check';
  const value = req.session.data['select-eligibility'];
  if (value === 'fep') {
    desiredRoute = 'funeral-expense-payments/landing.html';
  }

  if (value === 'bsp') {
    desiredRoute = 'bereavement-support-payments/landing.html'
  }
  res.redirect(prefix + desiredRoute);
});

router.get('*/complete', (req, res, next) => {
  const url = req.params[0].split('/');
  const eligiblityType = url[(url.length - 1)];
  if (eligiblityType.includes('bereavement')) {
    res.app.locals.bspComplete = true;
    res.app.locals.bspFailed = false;
  }
  if (eligiblityType.includes('funeral')) {
    res.app.locals.fepComplete = true;
    res.app.locals.fepFailed = false;
  }
  next();
})

const benefitsRedirect = (req, res, prefix) => {
  req.session.data.funeralBenefitsError = 'The caller must be in receipt or have one of the following benefits pending';
  res.redirect(prefix + 'qualifying-benefits');
};

router.get('*/check-qualifying-benefits', (req, res, next) => {
  const prefix = req.params[0] + '/';
  const data = req.session.data;
  const benefits = data['fep-qualifying-benefits'] || [];
  if (benefits.length) {
    if (benefits.length === 1 && benefits[0] === '_unchecked') {
      benefitsRedirect(req, res, prefix);
    } else {
      req.session.data.funeralBenefitsError = undefined;
      res.redirect(prefix + 'confirm');
    }
  } else {
    benefitsRedirect(req, res, prefix);
  }
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
