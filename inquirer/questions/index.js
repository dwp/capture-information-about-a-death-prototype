const callerDetails = require('./caller-details');
const partnerDetails = require('./partner-details');

/**
 * The aim is to kill the journey as quick as possible, so that the user
 * doesn't have to answer any questions they don't need to. Ask questions that
 * will determine whether they are eligible sooner, rather than later to save them time.
 * Asking explicitlly for age because datetime plugin doesn't support validation
 */
module.exports = [
  ...callerDetails,
  ...partnerDetails
]