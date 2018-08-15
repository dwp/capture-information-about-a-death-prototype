const bspEligibility = require('../bsp-eligibility.js');
const fepEligibility = require('../fep-eligibility.js');

const handleFailure = (msg, type, req, res) => {
  const prefix = req.params[0] + '/';
  const service = (type === 'bsp' ? 'bsp' : 'fep');
  req.session.data[service + 'Failure'] = msg;
  res.app.locals[service + 'Complete'] = true;
  res.app.locals[service + 'Failed'] = true;
  res.redirect(prefix + 'error');
}

const generateClasses = (state, type) => {
  let classes = '';
  if (state.failed || !state.eligible && !state.complete) {
    classes = 'govuk-card--error';
  } else if (state.complete) {
    classes = 'govuk-card--success';
  } else if (!state.eligible) {
    classes = `ineligible_${type}_claim_body`;
  }

  return classes;
}

/**
 * Uses the eligiblity state to determine the body content
 * @param {object} state
 */
const generateBody = (state, type) => {
  let body = `new_${type}_claim_body`;
  if (state.failed) {
    body = `fail_${type}_claim_body`;
  } else if (state.complete) {
    body = `complete_${type}_claim_body`;
  } else if (!state.eligible) {
    body = `ineligible_${type}_claim_body`;
  }

  return body;
}

const generateProps = (state, type) => {
  const body = generateBody(state, type);
  const classes = generateClasses(state);
  return {
    body,
    classes
  }
}

/**
 * Uses the request and response data to determine eligibly for FEP
 * @param {object} res
 * @param {object} req
 */
const generateState = (res, req, type) => {
  let eligiblityCheck = fepEligibility.isEligibleForFep;
  if (type !== 'fep') {
    eligiblityCheck = bspEligibility.isEligibleForBsp;
  }
  const complete = res.app.locals[type + 'Complete']
  const eligible = eligiblityCheck(req);
  const failed = res.app.locals[type + 'Failed']

  return {
    complete,
    eligible,
    failed
  }
};

/**
 * Returns an object of the eligiblity state and properties required to generate a card.
 * @param {object} res
 * @param {object} req
 */
const generateCard = (res, req, type = 'fep') => {
  const state = generateState(res, req, type);
  const props = generateProps(state, type);
  return {
    ...state,
    ...props
  }
};

module.exports = {
  handleFailure,
  generateCard
}