const bspEligibility = require('../bsp-eligibility.js');
const utils = require('./utils.js');
const { handleFailure } = utils;

const getVersion = ((url, index = 0) => url.slice(1).split('/')[index]);

const generateRoutes = (router) => {
  router.get('*/bereavement-support-payments/landing', (req, res, next) => {
    res.app.locals.isEligibleForBsp = bspEligibility.isEligibleForBsp(req.session.data);
    res.app.locals.isCallerSpouse = bspEligibility.isCallerSpouse(req.session.data);
    res.app.locals.isCallerWorkingAge = bspEligibility.isWorkingAge(req.session.data);
    next();
  });

  router.get('*/check-bsp-nino', (req, res) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['bsp-nino'] === 'true') {
      req.session.data.bspNinoError = undefined;
      res.redirect(prefix + 'dependants');
    } else {
      const error = 'You must have met the minimum NI contributions.';
      return handleFailure(error, 'bsp', req, res);
    }
  });

  router.get('*/check-bsp-dependants', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;
    res.redirect(prefix + 'confirm');
  });

  router.get('*/bank-details', (req, res, next) => {
    const { isCallerDap } = res.app.locals;
    console.log(res.app.locals.isCallerDap)
    const isProvidingBankDetails = req.session.data['bsp-use-bank'] === 'true';
    let route = '/confirm';
    const isCallerNok = req.session.data['death-arrears-nok'] === 'caller';
    console.log(isCallerNok, 'is caller nok')
    if (isProvidingBankDetails) {
      if (isCallerDap || isCallerNok) {
        route = '/bank-use-dap';
      } else {
        const version = getVersion(req.params[0], 1);

        route = '/add-bank';

        if (version === 'v9') {
          route = '/payee-bank-type';
        }
      }
    }
    res.redirect(req.params[0] + route);
  });

  router.get('*/handle-bank-details', (req, res) => {
    const useDapDetails = req.session.data['bsp-use-dap'] === 'true';
    let route = '/add-bank';
    if (useDapDetails) {
      route = '/check';
    }
    res.redirect(req.params[0] + route);
  });
};

module.exports = generateRoutes;
