'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production');
}

$(document).ready(function () {
  /**
   * If a hospital location select element exists, make it into an autocomplete element
   */
  var setupHospitalAutoComplete = function setupHospitalAutoComplete() {
    var hospitalLocationEl = document.getElementById('hospital-location');
    if (hospitalLocationEl) {
      var isSelectEl = hospitalLocationEl.tagName.toLowerCase() === 'select';

      if (isSelectEl) {
        accessibleAutocomplete.enhanceSelectElement({
          selectElement: hospitalLocationEl,
          classes: "govuk-!-width-two-thirds",
          name: "hospital-location-autocomplete"
        });
      }
    }
  };

  /**
   * Works out whether to show the deceased's marital status field
   * as well as auto populating it if possible
   */
  var getRelationshipStatus = function getRelationshipStatus() {
    var relationshipEl = document.getElementById('caller-relationship');
    if (relationshipEl) {
      var maritalStatusEl = document.getElementById('deceased-marital-status');
      var maritalStatusSecurityEl = document.querySelector('[value="security-marital-status"]');
      var relationships = ['husband', 'wife', 'exhusband', 'exwife'];

      /**
       * Checks whether the entered relationship to deceased can be mapped to a valid marital status
       * @type {string}
      */
      var isValidRelationship = function isValidRelationship(val) {
        return relationships.includes(val);
      };

      /**
       * If the maritalStatusEl exists and has a value then we should show the element on page load.
       * If a security question for marital status axists, check it and disable it
      */
      var showMaritalStatus = function showMaritalStatus() {
        if (maritalStatusEl && maritalStatusEl.value) {
          maritalStatusEl.classList.remove('js-hidden');
          maritalStatusEl.previousElementSibling.classList.remove('js-hidden');

          if (maritalStatusSecurityEl) {
            maritalStatusSecurityEl.setAttribute('disabled', '');
            maritalStatusSecurityEl.checked = true;
          }
        }
      };

      showMaritalStatus();

      /**
       * Maps the given value to a relevant marital status
       * @type {string}
       * @returns {string} the deceased's marital status
      */
      var mapRelationship = function mapRelationship(val) {
        switch (val) {
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

      relationshipEl.addEventListener('blur', function (event) {
        // make lowercase, remove spaces, remove hyphens and trim
        var value = event.target.value.toLowerCase().replace(/(\s)|(-)/g, '').trim();
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

  var conditionalBankSetup = function conditionalBankSetup() {
    // this will be different if no is preselected.
    var bankRadioEl = document.querySelector('.js-bank-or-building');
    if (bankRadioEl) {
      var answersEl = bankRadioEl.querySelectorAll('.govuk-radios__item');
      [].concat(_toConsumableArray(answersEl)).forEach(function (el) {
        el.addEventListener('change', function (event) {
          document.querySelector('.js-roll-number').classList.toggle('js-hidden');
        });
      });
    }
  };

  var fillManualFields = function fillManualFields(el, result) {
    var context = el.dataset.context;
    el.querySelector('[name="' + context + '-line-1"]').value = result.line1;
    el.querySelector('[name="' + context + '-line-2"]').value = result.line2;
    el.querySelector('[name="' + context + '-town-city"]').value = result.town;
    el.querySelector('[name="' + context + '-county"]').value = result.county;
    el.querySelector('[name="' + context + '-postcode"]').value = result.postcode;
  };

  var addressLookup = function addressLookup() {
    var postcode;
    var manualFields;

    var postcodeLookupEl = document.querySelectorAll('.js-postcode-lookup');
    if ([].concat(_toConsumableArray(postcodeLookupEl)).length) {
      [].concat(_toConsumableArray(postcodeLookupEl)).forEach(function (el) {
        el.addEventListener('click', function (event) {
          postcode = event.target.previousElementSibling.querySelector('input').value.toLowerCase().replace(/(\s)|(-)/g, '').trim();

          var parentEl = event.target.parentElement;
          var resultEl = parentEl.querySelector('select');
          var resultParent = parentEl.querySelector('.js-results-group');
          var addressResults = addresses[postcode];

          manualFields = parentEl.querySelector('.inset-address');

          resultEl.removeEventListener('change', handleAddressSelect);

          addressResults.forEach(function (address, index) {
            var result = document.createElement('option');
            result.text = address.summary;
            result.value = index;
            resultEl.add(result);
          });

          fillManualFields(manualFields, addresses[postcode][0]);

          resultParent.classList.remove('js-hidden');

          resultEl.addEventListener('change', handleAddressSelect, false);
        });
      });
    }

    function handleAddressSelect(event) {
      fillManualFields(manualFields, addresses[postcode][event.target.value]);
    }
  };

  // use a data attribute in the error summary for the tab its encapsulated in
  var testValidation = function testValidation() {
    var validationGroup = document.querySelector('.govuk-error-summary__list');
    if (validationGroup) {
      var errors = validationGroup.querySelectorAll('li');
      [].concat(_toConsumableArray(errors)).forEach(function (errEl) {
        errEl.addEventListener('click', function (el) {
          el.preventDefault();
          var targetEl = document.getElementById(el.target.hash.substr(1));
          window.location.hash = el.target.parentElement.dataset.tab;
          // 😱
          setTimeout(function () {
            targetEl.scrollIntoView();
          }, 0);
        });
      });
    }
  };

  var showTab = function showTab(tab) {
    tab.classList.remove('govuk-tabs__panel--hidden');
  };

  var hideTab = function hideTab(tab) {
    tab.classList.add('govuk-tabs__panel--hidden');
  };
  getRelationshipStatus();
  setupHospitalAutoComplete();
  conditionalBankSetup();
  addressLookup();
  testValidation();
});

// TODO ammend form action depending on route
