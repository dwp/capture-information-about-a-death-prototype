const generateRoutes = (router) => {
  router.get('*/dap-executor', (req, res) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['is-there-executor'] === 'true') {
      res.redirect(prefix + 'executor-details');
    } else {
      res.redirect(prefix + 'responsible-for-funeral');
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
      res.redirect(prefix + 'beneficiary');
    }
  })

  router.get('*/dap-beneficiary', (req, res) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['is-there-beneficiary'] === 'true') {
      res.redirect(prefix + 'beneficiary-details');
    } else {
      res.redirect(prefix + 'next-of-kin');
    }
  })

  router.get('*/dap-nok', (req, res) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['is-there-nok'] === 'true') {
      res.redirect(prefix + 'next-of-kin-details');
    } else {
      res.redirect(prefix + 'not-found');
    }
  })
};

module.exports = generateRoutes;
