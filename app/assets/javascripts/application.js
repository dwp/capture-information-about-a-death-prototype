/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  /**
   * If a hospital location select element exists, make it into an autocomplete element
   */
  const setupHospitalAutoComplete = () => {
    const hospitalLocationEl = document.getElementById('hospital-location');
    const isSelectEl = hospitalLocationEl.tagName.toLowerCase() === 'select';

    if (hospitalLocationEl && isSelectEl) {
      accessibleAutocomplete.enhanceSelectElement({
        selectElement: hospitalLocationEl,
        classes: "govuk-!-width-two-thirds",
        name: "hospital-location-autocomplete"
      });
    }
  }

  /**
   * Works out whether to show the deceased's marital status field
   * as well as auto populating it if possible
   */
  const getRelationshipStatus = () => {
    const relationshipEl = document.getElementById('caller-relationship');
    if (relationshipEl) {
      const maritalStatusEl = document.getElementById('deceased-marital-status');
      const maritalStatusSecurityEl = document.querySelector('[value="security-marital-status"]');
      const relationships = ['husband', 'wife', 'exhusband', 'exwife'];

      /**
       * Checks whether the entered relationship to deceased can be mapped to a valid marital status
       * @type {string}
      */
      const isValidRelationship = val => relationships.includes(val);

      /**
       * If the maritalStatusEl exists and has a value then we should show the element on page load.
       * If a security question for marital status axists, check it and disable it
      */
      const showMaritalStatus = () => {
        if (maritalStatusEl && maritalStatusEl.value) {
          maritalStatusEl.classList.remove('js-hidden');
          maritalStatusEl.previousElementSibling.classList.remove('js-hidden');

          if (maritalStatusSecurityEl) {
            maritalStatusSecurityEl.setAttribute('disabled', '')
            maritalStatusSecurityEl.checked = true;
          }
        }
      }

      showMaritalStatus();

      /**
       * Maps the given value to a relevant marital status
       * @type {string}
       * @returns {string} the deceased's marital status
      */
      const mapRelationship = val => {
        switch(val) {
          case 'husband':
          case 'wife':
            return 'married';
            // what about civil partnership? new laws may allow het couples to become civil partnered also
            // we don't know their gender, which could change anyway, to make this assumption
            // maybe the only assumption we can make is if they're the surviving spouse

          case 'exhusband':
          case 'exwife':
            return 'divorced';
            // What if they've remarried? If an ex-husband calls, it doesnt mean the deceased is divorced
            // They had to be divorced in the past, but may have remarried or entered a civil partnership

          default:
            return '';
        }
      };

      relationshipEl.addEventListener('blur', event => {
        // make lowercase, remove spaces, remove hyphens and trim
        const value = event.target.value.toLowerCase().replace(/(\s)|(-)/g, '').trim();
        // a relationship to the deceased that we care about
        if (isValidRelationship(value)) {
          if (maritalStatusEl) {
            maritalStatusEl.value = mapRelationship(value);
          }
          showMaritalStatus();
        }
      });
    }
  };

  getRelationshipStatus();
  setupHospitalAutoComplete();
})


// TODO ammend form action depending on route