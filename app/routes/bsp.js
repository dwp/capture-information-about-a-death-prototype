const utils = require('./utils.js');
const { handleFailure } = utils;

const generateRoutes = (router) => {
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

    if (isProvidingBankDetails) {
      if (isCallerDap) {
        route = '/bank-use-dap';
      } else {
        route = '/add-bank';
      }
    }
    res.redirect(req.params[0] + route);
  });

  router.get('*/handle-bank-details', (req, res) => {
    const useDapDetails = req.session.data['bsp-use-dap'] === 'true';
    let route = '/add-bank';
    if (useDapDetails) {
      route = '/confirm';
    }
    res.redirect(req.params[0] + route);
  });
};

module.exports = generateRoutes;