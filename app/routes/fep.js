const utils = require('./utils.js');
const fepEligibility = require('../fep-eligibility.js');
const { handleFailure } = utils;

const getVersion = ((url, index = 0) => url.slice(1).split('/')[index]);

const benefitsRedirect = (req, res) => {
  const version = getVersion(req.params[0], 1);
  let error = 'The caller must be in receipt or have one of the following benefits pending';

  if (version === 'v9') {
    error = 'The caller must be in receipt of a qualifying benefit';
  }

  return handleFailure(error, 'fep', req, res);
};

const firstQuestion = (data) => {
  if (fepEligibility.isCallerSpouse(data)) {
    return 'funeral-date';
  }
  return 'relationship';
}

const generateRoutes = (router) => {
  router.get('*/funeral-expense-payments/landing', (req, res, next) => {
    const version = getVersion(req.params[0], 1);
    res.app.locals.isEligibleForFep = fepEligibility.isEligibleForFep(req.session.data);

    if (version === 'v5' || version === 'v6' || version === 'v7' || version === 'v8' || version === 'v9') {
      next();
      return true;
    }
    const data = req.session.data;
    const age = fepEligibility.getClaimantAge(data);
    const isClaimantAdult = fepEligibility.isClaimantAdult(age);
    let fepStart = firstQuestion(data);

    if (!isClaimantAdult) {
      fepStart = 'student-or-training';
    }

    res.render('versions/' + version + '/funeral-expense-payments/landing.html', {
      fepStart
    });
  });

  router.get('*/check-student', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['student-or-training'] === 'true') {
      res.redirect(prefix + firstQuestion(data));
    } else {
      const error = 'The deceased must be an adult, please see Funeral Expenses for a child';
      return handleFailure(error, 'fep', req, res);
    }
  });

  router.get('*/check-relationship', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['living-as-married'] === 'true') {
      res.redirect(prefix + 'funeral-date');
    } else {
      const error = 'The caller must be living together as a married couple';
      return handleFailure(error, 'fep', req, res);
    }
  });

  router.get('*/check-funeral-date', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;
    const dateDiff = fepEligibility.validateFuneralDate(data['fep-funeral-date-year'], data['fep-funeral-date-month'], data['fep-funeral-date-day']);

    if (data['fep-funeral-date'] && dateDiff >= 6 && data['fep-funeral-date'] !== 'false') {
      const error = 'The date supplied is longer than 6 months ago.';
      return handleFailure(error, 'fep', req, res);
    } else {
      res.redirect(prefix + 'responsibility');
    }
  })

  router.get('*/check-funeral-information', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;
    const dateDiff = fepEligibility.validateFuneralDate(data['fep-funeral-date-year'], data['fep-funeral-date-month'], data['fep-funeral-date-day']);

    if (data['fep-funeral-date'] && dateDiff >= 6 && data['fep-funeral-date'] !== 'false') {
      const error = 'The date supplied is longer than 6 months ago.';
      return handleFailure(error, 'fep', req, res);
    } else {
      res.redirect(prefix + 'location');
    }
  })

  router.get('*/check-funeral-responsibility', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['fep-funeral-responsibility'] === 'true') {
      res.redirect(prefix + 'residency');
    } else {
      const error = 'The caller must take responsibility for the costs of the funeral';
      return handleFailure(error, 'fep', req, res);
    }
  });

  router.get('*/check-funeral-residency', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['fep-funeral-residency'] === 'true') {
      res.redirect(prefix + 'funeral-location');
    } else {
      const error = 'The deceased must ordinarily be a UK resident';
      return handleFailure(error, 'fep', req, res);
    }
  });

  router.get('*/check-funeral-location', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;
    const version = getVersion(req.params[0], 1);

    if (data['fep-funeral-location'] === 'true') {
      if (version === 'v5' || version === 'v6 ' || version === 'v9') {
        res.redirect(prefix + 'confirm');
      } else {
        res.redirect(prefix + 'qualifying-benefits');
      }
    } else {
      const error = 'The location of the funeral must be in the UK or EU';
      return handleFailure(error, 'fep', req, res);
    }
  });

  router.get('*/check-qualifying-benefits', (req, res, next) => {
    const version = getVersion(req.params[0], 1);
    const prefix = req.params[0] + '/';
    const data = req.session.data;
    const benefits = data['fep-qualifying-benefits'] || [];
    if (benefits.length) {
      if (benefits.length === 1 && benefits[0] === '_unchecked') {
        return benefitsRedirect(req, res, prefix);
      } else {
        if (version === 'v5' || version === 'v9') {
          res.redirect(prefix + 'funeral-date');
        } else {
          res.redirect(prefix + 'confirm');
        }
      }
    } else {
      return benefitsRedirect(req, res, prefix);
    }
  });
};

module.exports = generateRoutes;
