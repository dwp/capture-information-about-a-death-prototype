const getVersion = ((url, index = 0) => url.slice(1).split('/')[index]);

const generateRoutes = (router) => {
  router.get('*/dap-will', (req, res) => {
    const version = getVersion(req.params[0], 1);
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['is-there-will'] === 'true') {
      res.redirect(prefix + 'executor-details');
    } else {
      res.redirect(prefix + 'administrator');
    }
  });

  router.get('*/dap-administrator', (req, res) => {
    const version = getVersion(req.params[0], 1);
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['is-there-administrator'] === 'true') {
      res.redirect(prefix + 'administrator-details');
    } else {
      res.redirect(prefix + 'next-of-kin');
    }
  });

  router.get('*/dap-executor', (req, res) => {
    const version = getVersion(req.params[0], 1);
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['is-there-executor'] === 'true') {
      res.redirect(prefix + 'executor-details');
    } else {
      if (version === 'v9' || version === 'v10') {
        res.redirect(prefix + 'next-of-kin');
      } else {
        res.redirect(prefix + 'responsible-for-funeral');
      }
    }
  });

  router.get('*/dap-funeral', (req, res) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['is-there-funeral-responsible'] === 'true') {
      res.redirect(prefix + 'funeral-details');
    } else {
      res.redirect(prefix + 'maintainer');
    }
  })

  router.get('*/dap-maintainer', (req, res) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['is-there-maintainer'] === 'true') {
      res.redirect(prefix + 'maintainer-details');
    } else {
      res.redirect(prefix + 'next-of-kin');
    }
  })

  router.get('*/dap-nok', (req, res) => {
    const version = getVersion(req.params[0], 1);
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['is-there-nok'] === 'true') {
      res.redirect(prefix + 'next-of-kin-details');
    } else {
      if (version === 'v9' || version === 'v10') {
        res.redirect(prefix + 'who-should-we-pay');
      } else {
        res.redirect(prefix + 'not-found');
      }
    }
  });

  router.get('*/next-of-kin-payee-handler', (req, res) => {
    const version = getVersion(req.params[0], 1);
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['nok-responsible'] === 'true') {
      res.redirect(prefix + 'next-of-kin-payee');
    } else {
      res.redirect(prefix + 'next-of-kin-letter');
    }
  })

  router.get('*/other-payee', (req, res) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['death-arrears-pay-other'] === 'unknown') {
      res.redirect(prefix + 'not-found');
    } else {
      res.redirect(prefix + 'not-found-payee');
    }
  });

  router.get('*/payee-details', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const { data } = req.session;
    if (data['who-is-dap'] === 'idk') {
      return res.redirect(prefix + 'death-arrears-payee/not-found.html');
    }
    next();
  });
};

module.exports = generateRoutes;
