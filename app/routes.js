const express = require('express')
const router = express.Router()
const bspRoutes = require('./routes/bsp.js');
const fepRoutes = require('./routes/fep.js');
const utils = require('./routes/utils.js');
const fs = require('fs');
const { duplicateNinos, skipStartPageValidation } = require('./config.js');

// Route index page
router.get('/', function (req, res) {
  res.render('index')
});

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
  const arrearsCaller = req.session.data['death-arrears-caller'];
  if (arrearsCaller && arrearsCaller.toLowerCase() === 'unknown') {
    if (next) {
      next();
    }
    return false;
  }
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
};

router.get('*/check', (req, res, next) => {
  return isDapAvailable(req, res, next);
});

// If a start page in the version exists,
router.get('*/eligibility', (req, res, next) => {
  const url = req.params[0];
  const startExists = fs.existsSync('app/views' + url + '/start.html')

  if (startExists) {
    const data = req.session.data;

    // probably create an array of props and check the obj includes them all
    if (skipStartPageValidation) {
      next();
    } else if (data['skip-start-validation'] || (data['caller-full-name'] && data['caller-phone-number'] && data['deceased-national-insurance'] && data['deceased-full-name'])) {
      let normalisedNino = data['deceased-national-insurance'].replace(/\s+/g, '');

      if (duplicateNinos.includes(normalisedNino)) {
        res.redirect(req.params[0] + '/already-notified');
      }

      next();
    } else {
      res.redirect(req.params[0] + '/start');
    }
  }

  next();
});

router.get('*/already-notified', (req, res, next) => {
  const data = req.session.data;

  if (!data['deceased-national-insurance']) {
    res.redirect(req.params[0] + '/start');
  }

  next();
});

router.get('*/payee', (req, res, next) => {
  const deathArrearsPayee = req.session.data['death-arrears-caller'] || '';
  const payee = deathArrearsPayee.toLowerCase();
  const isSomeoneElse = 'someone-else';
  const isCaller = 'caller';
  const isKnownPayee = (payee === isCaller) || (payee === isSomeoneElse);
  const version = getVersion(req.params[0], 1);

  let route = req.params[0] + '/payee-bank';

  if (version === 'v2') {
    if (isKnownPayee) {
      if (payee === isSomeoneElse) {
        route = req.params[0] + '/payee-details';
      }

      res.app.locals.isCallerDap = (payee === isCaller);
      res.redirect(route);
    } else {
      res.redirect(req.params[0] + '/select-eligibility-cards');
      return;
    }

    next();
  } else if (payee === 'unknown') {
    res.redirect(req.params[0] + '/select-eligibility-cards');
    return;
  } else {
    res.app.locals.isCallerDap = (payee === 'true');
    next();
  }
});

router.get('*/benefits-handler', (req, res, next) => {
  const selectedBenefits = req.session.data['deceased-qualifying-benefits'] || [];
  const qualifyingBenefits = (benefits) => res.app.locals.qualifyingBenefits.find(benefit => benefits === benefit.value)
  const matches = selectedBenefits.map(item => qualifyingBenefits(item));
  const isHospitalCheckRequired = !!(matches.find(item => item.hospitalInterest));
  let route = '/select-eligibility';
  if (isHospitalCheckRequired) {
    route = '/hospital-lookup';
  }
  res.redirect(req.params[0] + route);
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
  if (req.session.data['deceased-dod-year'] === '1901') {
    req.session.data.eligibilityError = true;
    res.redirect(req.params[0] + '/eligibility');
    return true;
  }
  req.session.data.eligibilityError = false;
  if (isDapAvailable(req, res)) {
    return true;
  }

  res.render(req.params[0].substr(1) + '/select-eligibility-cards.html', {
    bspEligibility: utils.generateCard(req, res, 'bsp'),
    fepEligibility: utils.generateCard(req, res, 'fep')
  });
});

router.get('*/handle-eligibility', (req, res) => {
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

router.get('*/confirm', (req, res, next) => {
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
});

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

module.exports = router;
