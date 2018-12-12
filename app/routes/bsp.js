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

  router.get('*/bereavement-support-payments/has-bank-account', (req, res, next) => {
    const data = req.session.data;

    if (data['bsp-has-bank-or-building'] === "true") {
      res.redirect(req.params[0] + '/bereavement-support-payments/payee-bank-type');
    } else {
      res.redirect(req.params[0] + '/bereavement-support-payments/confirm');
    }
  });

  router.get('*/bank-details', (req, res, next) => {
    const data = req.session.data;
    const { isCallerDap } = res.app.locals;

    let route = '/confirm';
    const isCallerNok = data['death-arrears-nok'] === 'caller';
    const isCallerExecutor = data['death-arrears-executor'] === 'caller';
    const isCallerAdministrator = data['death-arrears-administrator'] === 'caller';
    const isCallerOtherDap = data['death-arrears-pay-other'] === 'caller';

    if (isCallerDap || isCallerNok || isCallerExecutor || isCallerAdministrator || isCallerOtherDap ) {
      route = '/bank-use-dap';
    } else {
      const version = getVersion(req.params[0], 1);

      route = '/payee-bank';

      if (version === 'v9') {
        route = '/payee-bank-type';
      }
    }
    res.redirect(req.params[0] + route);
  });

  router.get('*/handle-bank-details', (req, res) => {
    const useDapDetails = req.session.data['bsp-use-dap'] === 'true';
    let route = '/payee-bank';
    if (useDapDetails) {
      route = '/check';
    }
    res.redirect(req.params[0] + route);
  });
};

module.exports = generateRoutes;
