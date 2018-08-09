const utils = require('./utils.js');
const fepEligibility = require('../fep-eligibility.js');
const { handleFailure } = utils;

const benefitsRedirect = (req, res, prefix) => {
  req.session.data.funeralBenefitsError = 'The caller must be in receipt or have one of the following benefits pending';
  res.redirect(prefix + 'qualifying-benefits');
};

const generateRoutes = (router) => {
  router.get('*/check-relationship', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['living-as-married'] === 'true') {
      req.session.data.funeralRelationshipError = undefined;
      res.redirect(prefix + 'funeral-date');
    } else {
      req.session.data.funeralRelationshipError = 'The caller must be living together as a married couple';
      res.redirect(prefix + 'relationship');
    }
  });

  router.get('*/check-funeral-date', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;
    const dateDiff = fepEligibility.validateFuneralDate(data['fep-funeral-date-year'], data['fep-funeral-date-month'], data['fep-funeral-date-day']);

    if (data['fep-funeral-date'] && dateDiff >= 6 && data['fep-funeral-date'] !== 'false') {
      req.session.data.funeralDateError = 'The date supplied is longer than 6 months ago.';
      res.redirect(prefix + 'funeral-date');
    } else {
      req.session.data.funeralDateError = undefined;
      res.redirect(prefix + 'responsibility');
    }
  })

  router.get('*/check-funeral-responsibility', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['fep-funeral-responsibility'] === 'true') {
      req.session.data.funeralResponsibilityError = undefined;
      res.redirect(prefix + 'residency');
    } else {
      req.session.data.funeralResponsibilityError = 'The caller must take responsibility for the costs of the funeral';
      res.redirect(prefix + 'responsibility');
    }
  });

  router.get('*/check-funeral-residency', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['fep-funeral-residency'] === 'true') {
      req.session.data.funeralResidencyError = undefined;
      res.redirect(prefix + 'funeral-location');
    } else {
      req.session.data.funeralResidencyError = 'The deceased must ordinarily be a UK resident';
      res.redirect(prefix + 'residency');
    }
  });

  router.get('*/check-funeral-location', (req, res, next) => {
    const prefix = req.params[0] + '/';
    const data = req.session.data;

    if (data['fep-funeral-location'] === 'true') {
      req.session.data.funeralLocationError = undefined;
      res.redirect(prefix + 'qualifying-benefits');
    } else {
      req.session.data.funeralLocationError = 'The location of the funeral must be in the UK or EU';
      res.redirect(prefix + 'funeral-location');
    }
  });

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
};

module.exports = generateRoutes;