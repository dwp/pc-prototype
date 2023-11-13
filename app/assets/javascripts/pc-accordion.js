/* global window, document */
/* eslint-disable no-param-reassign, no-var, prefer-destructuring, prefer-template, vars-on-top */

(function (Modules) {
  var Accordion = Modules.Accordion;

  function PCAccordion($module) {
    Accordion.call(this, $module);
    // Show (v) / Hide (^) SVG
    this.icon = '<span class="govuk-visually-hidden">, </span><span class="gem-c-step-nav__toggle-link js-toggle-link"><span class="gem-c-step-nav__button-text js-toggle-link-text">show</span><span class="gem-c-step-nav__chevron js-toggle-link-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="gem-c-step-nav__chevron-stroke" d="M0.499997 10C0.499998 4.75329 4.75329 0.499999 10 0.499999C15.2467 0.5 19.5 4.75329 19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.75329 19.5 0.499997 15.2467 0.499997 10Z" stroke="#1D70B8"></path><path class="gem-c-step-nav__chevron-stroke" d="M13.6738 8.67383L10 12.3477L6.32617 8.67383" stroke="#1D70B8" stroke-width="2"></path></svg></span></span><span class="govuk-visually-hidden"> this section</span>';
  }

  // Clone GOV.UK Accordion Component
  PCAccordion.prototype = Object.create(Accordion.prototype);
  PCAccordion.prototype.constructor = PCAccordion;

  // Initialise controls and set attributes only if there's more than one section
  PCAccordion.prototype.initControls = function () {
    if (this.$sections.length > 1) {
      Accordion.prototype.initControls.call(this);
      this.$openAllButton.innerHTML = 'Show all <span class="govuk-visually-hidden">sections</span>';
    }
  };

  // Set individual header attributes
  PCAccordion.prototype.initHeaderAttributes = function ($headerWrapper, index) {
    // Run existing Accordion code
    Accordion.prototype.initHeaderAttributes.call(this, $headerWrapper, index);

    // Reset button content to its text content in span (removing +/- icon)
    var $button = $headerWrapper.querySelector('.' + this.sectionButtonClass);
    $button.innerHTML = '<span>' + $button.textContent + '</span>';

    // Add "Show/Hide" and SVG icon
    var $icon = document.createElement('span');
    $icon.innerHTML = this.icon;
    $button.appendChild($icon);
  };

  // Set section attributes when opened/closed
  PCAccordion.prototype.setExpanded = function (expanded, $section) {
    // Run existing Accordion code
    Accordion.prototype.setExpanded.call(this, expanded, $section);
    var iconText = $section.querySelector('.js-toggle-link-text');

    // Toggle show/hide content on expand/collapse
    if (expanded) {
      iconText.innerHTML = 'hide';
    } else {
      iconText.innerHTML = 'show';
    }
  };

  // Update "Show all" button (if it exists)
  Accordion.prototype.updateOpenAllButton = function (expanded) {
    if (this.$openAllButton) {
      var newButtonText = expanded ? 'Hide all' : 'Show all';
      newButtonText += '<span class="govuk-visually-hidden"> sections</span>';
      this.$openAllButton.setAttribute('aria-expanded', expanded);
      this.$openAllButton.innerHTML = newButtonText;
    }
  };

  Modules.PCAccordion = PCAccordion;
}(window.GOVUKFrontend));
