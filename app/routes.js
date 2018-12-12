const express = require('express')
const router = express.Router()
const bspRoutes = require('./routes/bsp.js');
const dapRoutes = require('./routes/dap.js');
const fepRoutes = require('./routes/fep.js');
const utils = require('./routes/utils.js');
const fs = require('fs');
const { duplicateNinos, skipStartPageValidation } = require('./config.js');
const differenceInYears = require('date-fns/difference_in_years')


// Route index page
router.get('/', function (req, res) {
  res.render('index')
});

bspRoutes(router);
dapRoutes(router);
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

// Note: This may break things, keep an eye on it
// router.get('*/check', (req, res, next) => {
//   return isDapAvailable(req, res, next);
// });

// If a start page in the version exists,
router.get('*/eligibility', (req, res, next) => {
  const url = req.params[0];
  const startExists = fs.existsSync('app/views' + url + '/start.html')
  if (startExists) {
    const data = req.session.data;
    res.app.locals.isCallerSpouse = utils.isCallerSpouse(data['caller-relationship']);

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

router.get('*/fail-nino', (req, res, next) => {
  const data = req.session.data;
  let normalisedNino = data['deceased-national-insurance'].replace(/\s+/g, '');

  if (duplicateNinos.includes(normalisedNino)) {
    res.redirect(req.params[0] + '/already-notified');
  } else {
    res.redirect(req.params[0] + '/already-notified');
  }
})

router.get('*/already-notified', (req, res, next) => {
  const data = req.session.data;

  if (!data['deceased-national-insurance']) {
    res.redirect(req.params[0] + '/start');
  }
  res.app.locals.ninoFailed = true;

  next();
});

// Feel free to tidy this up, its in my todo, morphed into this during a UR session!!
router.get('*/payee', (req, res, next) => {
  const deathArrearsPayee = req.session.data['death-arrears-caller'] || '';
  const payee = deathArrearsPayee.toLowerCase();
  const isSomeoneElse = 'someone-else';
  const isCaller = 'caller';
  const isKnownPayee = (payee === isCaller) || (payee === isSomeoneElse);
  const version = getVersion(req.params[0], 1);

  console.log({
    deathArrearsPayee,
    payee,
    isKnownPayee
  });

  let route = req.params[0] + '/payee-bank';

  if (version!== 'base' || version !== 'v1') {
    if (isKnownPayee) {
      console.log(payee, 'payee')
      if (payee === isSomeoneElse) {
        console.log('please not here')
        route = req.params[0] + '/payee-details';
        res.app.locals.isCallerDap = false;
      } else {
        console.log('am i here?')
        res.app.locals.isCallerDap = true;
      }

      res.app.locals.dNComplete = true;
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

router.get('*/payee-bank-test', (req, res, next) => {
  console.log('bank test')
  const deathArrearsPayee = req.session.data['death-arrears-caller'] || '';
  const payee = deathArrearsPayee.toLowerCase();
  const isSomeoneElse = 'someone-else';
  const isCaller = 'caller';
  const isKnownPayee = (payee === isCaller) || (payee === isSomeoneElse);

  let route = req.params[0] + '/payee-bank';

  if (isKnownPayee) {
    console.log(payee, 'payee')
    if (payee === isSomeoneElse) {
      console.log('please not here')
      route = req.params[0] + '/payee-details';
      res.app.locals.isCallerDap = false;
    } else {
      console.log('am i here?')
      res.app.locals.isCallerDap = true;
      return next();
    }

    res.app.locals.dNComplete = true;
    console.log(route)
    res.redirect(route);
  } else {
    res.redirect(req.params[0] + '/select-eligibility-cards');
    return;
  }

  next();
})

router.get('*/benefits-handler*', (req, res, next) => {
  const data = req.session.data;
  const isSpouse = utils.isCallerSpouse(data['caller-relationship']);
  const version = getVersion(req.params[0], 1);
  const selectedBenefits = req.session.data['deceased-qualifying-benefits'] || [];
  const qualifyingBenefits = (benefits) => res.app.locals.qualifyingBenefits.find(benefit => benefits === benefit.value)
  const matches = selectedBenefits.map(item => qualifyingBenefits(item));
  const isHospitalCheckRequired = !!(matches.find(item => item.hospitalInterest));
  let route = '/select-eligibility-cards' + req.params[1];
  if (isHospitalCheckRequired && data['hospital-death'] === undefined) {
    route = '/hospital-lookup';
  } else if ((version === 'v8' || version === 'v9') && isSpouse) {
    route = '/capture-spouse';
  } else if ((version === 'v8' || version === 'v9') && selectedBenefits.length) {
    route = '/death-arrears-payee/start';
  } else if (selectedBenefits.length) {
    route = '/death-arrears';
  } else if (version === 'v8' || version === 'v9'){
    route = '/bereavement-support-payments/landing'
  } else {
    route = '/select-eligibility-cards';
  }

  res.redirect(req.params[0] + route);
});

router.get('*/spouse-handler', (req, res, next) => {
  const data = req.session.data;
  const isSpouse = utils.isCallerSpouse(data['caller-relationship']);
  let route = '/benefits-handler';
  if (isSpouse) {
    route = '/capture-spouse';
  }
  res.redirect(req.params[0] + route);
});

router.get('*/spouse-data', (req, res, next) => {
  const data = req.session.data;
  const month = parseInt(data['spouse-dob-month']) - 1;
  const age = differenceInYears(new Date(), new Date(data['spouse-dob-year'], month, data['spouse-dob-day']))
  let route = '/death-arrears-payee/start';
  if (age >= 63 && age < 66) {
    route = '/pension-age'
  }
  res.redirect(req.params[0] + route);
});

router.get('*/death-arrears-payee/start', (req, res, next) => {
  const data = req.session.data;
  const selectedBenefits = data['deceased-qualifying-benefits'] || [];
  if (!selectedBenefits.length) {
    res.redirect(req.params[0] + '/bereavement-support-payments/landing');
  } else {
    next();
  }
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

router.get('*/select-eligibility-cards*', (req, res) => {
  if (req.session.data['deceased-dod-year'] === '1901') {
    req.session.data.eligibilityError = true;
    res.redirect(req.params[0] + '/eligibility');
    return true;
  }
  req.session.data.eligibilityError = false;
  if (isDapAvailable(req, res)) {
    return true;
  }

  let body = res.app.locals.dNComplete ? 'send_death_notification_claim_body' : 'new_death_notification_claim_body';
  if (res.app.locals.ninoFailed) {
    body = 'nino_failed_death_notification_body';
  }

  console.log('has nino failed', !!res.app.locals.ninoFailed)
  res.render(req.params[0].substr(1) + '/select-eligibility-cards' + req.params[1] + '.html', {
    bspEligibility: utils.generateCard(req, res, 'bsp'),
    fepEligibility: utils.generateCard(req, res, 'fep'),
    notification: {
      body: body,
      failed: !!res.app.locals.ninoFailed
    }
  });
});

router.get('*/deceased-benefits', (req, res, next) => {
  res.app.locals.dNComplete = true;
  console.log('wait', res.app.locals.dNComplete)
  next();
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

router.get('*/has-bank-account', (req, res, next) => {
  const data = req.session.data;

  if (data['dap-has-bank-or-building'] === "true") {
    res.redirect(req.params[0] + '/payee-bank-type');
  } else {
    res.redirect(req.params[0] + '/select-eligibility-cards');
  }
});

router.get('*/bank-account-type', (req, res, next) => {
  const data = req.session.data;

  if (data['dap-bank-or-building'] === "bank") {
    res.redirect(req.params[0] + '/payee-bank-account-details');
  } else {
    res.redirect(req.params[0] + '/payee-building-society-account-details');
  }
});

module.exports = router;
