const utils = require('./utils.js');
const { handleFailure } = utils;

const generateRoutes = (router) => {
  router.get('*/check-bsp-nino', (req, res) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['bsp-nino'] === 'true') {
      req.session.data.bspNinoError = undefined;
      res.redirect(prefix + 'marriage-certificate');
    } else {
      const error = 'You must have met the minimum NI contributions.';
      return handleFailure(error, 'bsp', req, res);
    }
  });

  router.get('*/check-bsp-marriage-cert', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['bsp-marriage-cert'] === 'true') {
      req.session.data.bspMarriageError = undefined;
      res.redirect(prefix + 'dependants');
    } else {
      const error = 'You must be married or be in a civil partnership with the person who died';
      return handleFailure(error, 'bsp', req, res);
    }
  });

  router.get('*/check-bsp-dependants', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;
    res.redirect(prefix + 'confirm');
  });
};

module.exports = generateRoutes;