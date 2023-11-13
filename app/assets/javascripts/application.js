/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
  var $accordions = document.querySelectorAll('[data-module="pc-accordion"]')
  $accordions.forEach(function ($accordion) {
    new GOVUKFrontend.PCAccordion($accordion).init()
  })
})
