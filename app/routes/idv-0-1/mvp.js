const express = require('express')
const { getStatePensionDate } = require('get-state-pension-date')
const differenceInDays = require('date-fns/differenceInDays')
const startOfDay = require('date-fns/startOfDay')
const subMonths = require('date-fns/subMonths')
const got = require('got')
const fs = require('fs')
const {getMonth} = require('../../filters')()

const router = new express.Router()
const baseUrl = '/idv-0-1/mvp'

const path = require('path');


function makeAStay(data) {
  const admission = new Date(`${data['admission-year']}-${data['admission-month']}-${data['admission-day']}`)
  const discharge = new Date(`${data['discharge-year']}-${data['discharge-month']}-${data['discharge-day']}`)
  const totalDays = Math.max(differenceInDays(discharge, admission) - 1, 0)
  return {admission, discharge, totalDays}
}

// PDF DOWNLOADER
router.use(`${baseUrl}/claim.pdf`, express.static(path.resolve('app/views/citizen-version-2-8-ur/mvp/claim.pdf'))) // ../ back up a directory

// —————————————————————————————————

// START ARRAY
// router.post(`${baseUrl}/start-check-router`, (req, res) => {
//   const startCheck = req.session.data['start-check']
//   const startCheckArr = Array.isArray(startCheck) ? startCheck : [startCheck]
//   // startCheckArr includes both 'ni' and 'money'
//   if (startCheckArr.includes('ni') && startCheckArr.includes('money')) {
//     res.redirect(`${baseUrl}/reside-in-uk`)
//   }
//   // startCheckArr includes 'ni'
//   else if (startCheckArr.includes('ni')) {
//     res.redirect(`${baseUrl}/start-check-error`)
//   }
//   // startCheckArr includes 'money'
//   else if (startCheckArr.includes('money')) {
//     res.redirect(`${baseUrl}/start-check-error`)
//   }
//   // startCheckArr includes neither 'money' or 'ni'
//   else {
//     res.redirect(`${baseUrl}/start-check-error`)
//   }
// })


router.post(`${baseUrl}/start-check-router`, (req, res) => {
  const startCheck = req.session.data['start-check']

  if (startCheck === 'Yes') {
    res.redirect(`${baseUrl}/reside-in-uk`)
  } else {
    res.redirect(`${baseUrl}/start-check-no`)
  }
})

router.post(`${baseUrl}/security-router`, (req, res) => {
  const passedSecurity = req.session.data['passed-security']

  if (passedSecurity === 'Yes') {
    res.redirect(`${baseUrl}/name-and-nino`)
  } else {
    res.redirect(`${baseUrl}/agent-action`)
  }
})


router.post(`${baseUrl}/partner-under-spa-router`, (req, res) => {
  const hasPartner = req.session.data['has-partner']

  if (hasPartner === 'Yes') {
    res.redirect(`${baseUrl}/done-has-partner`)
  } else {
    res.redirect(`${baseUrl}/mvp-eligibility-summary`)
  }
})


router.post(`${baseUrl}/who-lives-with-you-router`, (req, res) => {
  const whoLivesWithYou = req.session.data['who-lives-with-you']
  console.log(whoLivesWithYou);

  if (whoLivesWithYou === 'Live alone') {
    res.redirect(`${baseUrl}/claim-date-cam-idoc-yn`)
  } else {
    res.redirect(`${baseUrl}/who-lives-with-you-types`)
  }
})



router.post(`${baseUrl}/clear-data-yn-router`, (req, res) => { // router name
  const privacyPolicy = req.session.data['clear-data-yn']  // name of data / id name

  if (privacyPolicy === 'Agree') { // name of data / + answer
    res.redirect(`${baseUrl}/clear-data`)
  } else {
    res.redirect(`${baseUrl}/out-privacy-policy`)
  }
})


router.post(`${baseUrl}/claim-date-options-router`, (req, res) => {
  const claimDateOptions = req.session.data['claim-date-options']

  if (claimDateOptions === 'Advanced') {
    res.redirect(`${baseUrl}/claim-date-options-advanced`)
  }
  else if (claimDateOptions === 'Today') {
    res.redirect(`${baseUrl}/claim-date-options-today`)
  }
  else if (claimDateOptions === 'BackdatingManual') {
    res.redirect(`${baseUrl}/claim-date-manual-idoc-yn`)
  }
  else if (claimDateOptions === 'CAMdate') {
    res.redirect(`${baseUrl}/claim-date-cam-idoc-yn`)
  }
  else if (claimDateOptions === 'December Date of claim') {
    res.redirect(`${baseUrl}/DOC-claim-idoc-yn`)
  } else {
    res.redirect(`${baseUrl}/claim-date-idoc-yn`)
  }
})



router.post(`${baseUrl}/claim-date-test-router`, (req, res) => {
  const claimDateTest = req.session.data['claim-date-options-backdating-yn']

  if (claimDateTest === 'Yes') {
    res.redirect(`${baseUrl}/claim-date-options-backdating-outside-yes`)
  } else {
    res.redirect(`${baseUrl}/claim-date-options-backdating-benefit-check`)
  }
})

router.post(`${baseUrl}/claim-date-options-backdating-outside-yn-router`, (req, res) => {
  const claimDateTest = req.session.data['claim-date-options-backdating-outside-yn']

  if (claimDateTest === 'Yes') {
    res.redirect(`${baseUrl}/claim-date-options-backdating-outside-reason`)
  } else {
    res.redirect(`${baseUrl}/claim-date-manual-eed-daf-yn`)
  }
})

router.post(`${baseUrl}/claim-date-options-backdating-changes-yn-router`, (req, res) => {
  const claimDateTest = req.session.data['claim-date-options-backdating-changes-yn']

  if (claimDateTest === 'Yes') {
    res.redirect(`${baseUrl}/claim-date-options-backdating-changes-out`)
  } else {
    res.redirect(`${baseUrl}/claim-date-summary`)
  }
})


router.post(`${baseUrl}/claim-date-options-backdating-benefit-check-yn-router`, (req, res) => {
  const claimDateTest = req.session.data['claim-date-options-backdating-benefit-check-yn']

  if (claimDateTest === 'Yes') {
    res.redirect(`${baseUrl}/claim-date-options-backdating-alt`)
  } else {
    res.redirect(`${baseUrl}/claim-date-options-backdating-alt`)
  }
})




router.post(`${baseUrl}/claim-date-options-backdating-outside-reason-router`, (req, res) => {
  const backdatingOutsideReason = req.session.data['claim-date-options-backdating-outside-reason']

  if (backdatingOutsideReason === 'Something else') {
    res.redirect(`${baseUrl}/claim-date-options-backdating-outside-out`)
  } else {
    res.redirect(`${baseUrl}/claim-date-manual-eed-daf-yn`)
  }
})


router.post(`${baseUrl}/claim-date-options-today-yn-router`, (req, res) => {
  const claimDateTest = req.session.data['claim-date-options-today-yn']

  if (claimDateTest === 'Yes') {
    res.redirect(`${baseUrl}/claim-date-summary`)
  } else {
    res.redirect(`${baseUrl}/claim-date-options-today-out`)
  }
})




router.post(`${baseUrl}/claim-date-options-advanced-yn-router`, (req, res) => {
  const claimDateTest = req.session.data['claim-date-options-advanced-yn']

  if (claimDateTest === 'Yes') {
    res.redirect(`${baseUrl}/claim-date-summary`)
  } else {
    res.redirect(`${baseUrl}/claim-date-options-advanced-out`)
  }
})



router.post(`${baseUrl}/claim-date-manual-eed-daf-yn-router`, (req, res) => {
  const claimDateManualEedDaf = req.session.data['claim-date-manual-eed-daf-yn']

  if (claimDateManualEedDaf === 'multi-changes') {
    res.redirect(`${baseUrl}/claim-date-manual-enter-cam-reason`)
  }
  else if (claimDateManualEedDaf === 'stable-date') {
    res.redirect(`${baseUrl}/claim-date-manual-eed-daf-reason`)
  } else {
    res.redirect(`${baseUrl}/claim-date-manual-eed-daf-reason-outcome`)
  }
})






router.post(`${baseUrl}/contact-correspondence-yn-router`, (req, res) => {
  const contactCorrespondenceYN = req.session.data['contact-correspondence-yn']

  if (contactCorrespondenceYN === 'Yes') {
    res.redirect(`${baseUrl}/contact-correspondence-address`)
  } else {
    res.redirect(`${baseUrl}/contact-summary`)
  }
})


// Contact


router.post(`${baseUrl}/contact-text-yn-router`, (req, res) => {
  const canText = req.session.data['contact-text-yn']

  if (canText === 'Yes') {
    res.redirect(`${baseUrl}/contact-mobile-can-call`)
  } else {
    res.redirect(`${baseUrl}/contact-other-number`)
  }
})


router.post(`${baseUrl}/contact-mobile-can-call-router`, (req, res) => {
  const canText = req.session.data['contact-text-yn']

  if (canText === 'Yes') {
    res.redirect(`${baseUrl}/contact-translator`)
  } else {
    res.redirect(`${baseUrl}/contact-translator`)
  }
})

router.post(`${baseUrl}/contact-other-number-router`, (req, res) => {
  const canText = req.session.data['contact-text-yn']

  if (canText === 'Yes') {
    res.redirect(`${baseUrl}/contact-translator`)
  } else {
    res.redirect(`${baseUrl}/contact-translator`)
  }
})







// Contact end




router.post(`${baseUrl}/over-spa-router`, (req, res) => {
  try {
    const dob = req.session.data['dob-year'] + '-' +
      req.session.data['dob-month'].padStart(2, '0') + '-' +
      req.session.data['dob-day'].padStart(2, '0')

    const today = startOfDay(new Date())
    const maleSpaDate = getStatePensionDate(dob, 'M')
    const femaleSpaDate = getStatePensionDate(dob, 'F')
    const daysSinceMaleSPA = differenceInDays(today, maleSpaDate)
    const daysSinceFemaleSPA = differenceInDays(today, femaleSpaDate)

    if (daysSinceMaleSPA >= 0 && daysSinceFemaleSPA >= 0) {
      const threeMonthsAgo = subMonths(today, 3)
      req.session.data['back-dating-date'] = maleSpaDate < threeMonthsAgo ? threeMonthsAgo : maleSpaDate
      req.session.data['spa-date'] = maleSpaDate

      res.redirect(`${baseUrl}/reside-in-uk`)
    } else if (daysSinceMaleSPA < 0 && daysSinceFemaleSPA < 0) {
      res.redirect(`${baseUrl}/reside-in-uk`)
    } else {
      res.redirect(`${baseUrl}/sex`)
    }
  } catch (err) {
    res.redirect(`${baseUrl}/state-pension-check-yn`)
  }
})

router.post(`${baseUrl}/sex-router`, (req, res) => {
  try {
    const dob = req.session.data['dob-year'] + '-' +
      req.session.data['dob-month'].padStart(2, '0') + '-' +
      req.session.data['dob-day'].padStart(2, '0')

    const sex = req.session.data['sex'] || 'M'
    const spaDate = getStatePensionDate(dob, sex)

    req.session.data['spa-date'] = spaDate
    res.redirect(`${baseUrl}/reside-in-uk`)
  } catch (err) {
    res.redirect(`${baseUrl}/reside-in-uk`)
  }
})

router.post(`${baseUrl}/reside-in-uk-router`, (req, res) => {
  const residesInUk = req.session.data['resides-in-uk']

  if (residesInUk === 'England') {
    res.redirect(`${baseUrl}/over-spa`)
  } else if (residesInUk === 'Scotland') {
    res.redirect(`${baseUrl}/over-spa`)
  } else if (residesInUk === 'Wales') {
    res.redirect(`${baseUrl}/over-spa`)
  } else if (residesInUk === 'Northern-Ireland') {
    res.redirect(`${baseUrl}/over-spa`)
  } else {
    res.redirect(`${baseUrl}/done-none-uk`)
  }
})



router.post(`${baseUrl}/lived-abroad-router`, (req, res) => {
  const residesInUk = req.session.data['lived-abroad']

  if (residesInUk === 'Yes') {
    res.redirect(`${baseUrl}/uk-national`)
  } else {
    res.redirect(`${baseUrl}/hrt-flag-2-years-prompt`)
  }
})

router.post(`${baseUrl}/uk-national-router`, (req, res) => {
  const residesInUk = req.session.data['uk-national']

  if (residesInUk === 'Yes') {
    res.redirect(`${baseUrl}/over-spa`)
  } else {
    res.redirect(`${baseUrl}/hrt-flag-immigration-prompt`)
  }
})

router.post(`${baseUrl}/children-check-yn-router`, (req, res) => {
  const childrenCheck = req.session.data['children-check-yn']

  if (childrenCheck === 'No') {
    res.redirect(`${baseUrl}/claim-filter`)
  } else {
    res.redirect(`${baseUrl}/done-children`)
  }
})

router.post(`${baseUrl}/state-pension-check-yn-router`, (req, res) => {
  const statePensionCheck = req.session.data['state-pension-check-yn']

  if (statePensionCheck === 'Yes') {
    res.redirect(`${baseUrl}/children-check-yn`)
  } else {
    res.redirect(`${baseUrl}/done-not-getting-sp`)
  }
})

router.post(`${baseUrl}/partner-check-yn-router`, (req, res) => {
  const partnerCheck = req.session.data['partner-check-yn']

  if (partnerCheck === 'Yes, we live together') {
    res.redirect(`${baseUrl}/partner-app-check`)
  } else {
    res.redirect(`${baseUrl}/data-we-use`)
  }
})


router.post(`${baseUrl}/claim-filter-router`, (req, res) => {
  const claimFilter = req.session.data['claim-filter']

  if (claimFilter === 'Normal') {
    res.redirect(`${baseUrl}/doc-absence`)
  } else if (claimFilter === 'Today') {
    res.redirect(`${baseUrl}/partner-check-yn`)
  } else {
    res.redirect(`${baseUrl}/claim-notification`)
  }
})

router.post(`${baseUrl}/doc-absence-router`, (req, res) => {
  const docAbsence = req.session.data['doc-absence']

  if (docAbsence === 'Yes') {
    res.redirect(`${baseUrl}/doc-absence-plural`)
  } else {
    res.redirect(`${baseUrl}/doc-draft-date`)
  }
})

router.post(`${baseUrl}/doc-absence-medical-single-router`, (req, res) => {
  const docAbsenceSingleMedical = req.session.data['doc-absence-medical']

  if (docAbsenceSingleMedical === 'Yes') {
    res.redirect(`${baseUrl}/partner-check-yn`)
  } else {
    res.redirect(`${baseUrl}/doc-absence-dates`)
  }
})

router.post(`${baseUrl}/doc-absence-medical-plural-router`, (req, res) => {
  const docAbsencePluralMedical = req.session.data['doc-absence-medical']

  if (docAbsencePluralMedical === 'Yes') {
    res.redirect(`${baseUrl}/partner-check-yn`)
  } else {
    res.redirect(`${baseUrl}/partner-check-yn`)
  }
})

router.post(`${baseUrl}/doc-draft-date-router`, (req, res) => {
  const docDraftDate = req.session.data['doc-draft-date']

  if (docDraftDate === 'Yes') {
    res.redirect(`${baseUrl}/partner-check-yn`)
  } else {
    res.redirect(`${baseUrl}/doc-alt-date`)
  }
})





router.post(`${baseUrl}/partner-mac-yn-router`, (req, res) => {
  const macPartnerCheck = req.session.data['partner-mac-yn']

  if (macPartnerCheck === 'Yes') {
    res.redirect(`${baseUrl}/partner-app-check`)
  } else {
    res.redirect(`${baseUrl}/done-partner`)
  }
})

router.post(`${baseUrl}/single-joint-check-router`, (req, res) => {
  const singleJoint = req.session.data['single-joint-check']

  if (singleJoint === 'Single') {
    res.redirect(`${baseUrl}/home-hospital-check`)
  } else {
    res.redirect(`${baseUrl}/partner-national-insurance`)
  }
})

router.post(`${baseUrl}/home-hospital-check-router`, (req, res) => {
  const hospitalCheck = req.session.data['home-hospital-check']

  if (hospitalCheck === 'Yes') {
    res.redirect(`${baseUrl}/home-hospital-funding`)
  } else {
    res.redirect(`${baseUrl}/home-care-home-check`)
  }
})




// Employment router CB (employment-check)



router.post(`${baseUrl}/employment-single-joint-router`, (req, res) => {
  const employedSingleJoint = req.session.data['employment-single-joint']

  if (employedSingleJoint === 'Single') {
    res.redirect(`${baseUrl}/employment-details`)
  } else {
    res.redirect(`${baseUrl}/employment-you-or-partner`)
  }
})


router.post(`${baseUrl}/employment-check-router`, (req, res) => {
  const isEmployed = req.session.data['employment-check']

  if (isEmployed === 'Yes') {
    res.redirect(`${baseUrl}/employment-prompt`)
  } else {
    res.redirect(`${baseUrl}/self-employed`)
  }
})

router.post(`${baseUrl}/self-employed-router`, (req, res) => {
  const selfEmployed = req.session.data['self-employed']

  if (selfEmployed === 'Yes') {
    res.redirect(`${baseUrl}/about-your-self-employment`)
  } else {
    res.redirect(`${baseUrl}/employment-other-money`)
  }
})


// Employment add another router CB (employment-check)

router.post(`${baseUrl}/employment-add-another-router`, (req, res) => {
  const employmentAddAnother = req.session.data['employment-add-another-check']

  if (employmentAddAnother === 'Yes') {
    res.redirect(`${baseUrl}/employment-details`)
  } else {
    res.redirect(`${baseUrl}/self-employed`)
  }
})




router.post(`${baseUrl}/hospital-time-router`, (req, res) => {
  const accountType = req.session.data['hospital-yn']

  if (accountType === 'Yes') {
    res.redirect(`${baseUrl}/add-hospital-dates`)
  } else {
    res.redirect(`${baseUrl}/other-income-overview`)
  }
})

// NON DEPS




router.post(`${baseUrl}/non-deps-living-with-you-router`, (req, res) => {
  const nonDepsCheck = req.session.data['non-deps-living-with-you']

  if (nonDepsCheck === 'Yes') {
    res.redirect(`${baseUrl}/non-deps-prompt`)
  }
  else if (nonDepsCheck === 'Yes') {
    res.redirect(`${baseUrl}/non-deps-prompt`)
  }
  else if (nonDepsCheck === 'Yes-more') {
    res.redirect(`${baseUrl}/non-deps-multi-member-details`)
  } else {
    res.redirect(`${baseUrl}/benefit-UC-Carer`)
  }
})

router.post(`${baseUrl}/non-deps-summary-router`, (req, res) => {
  const nonDepsSummary = req.session.data['non-deps-summary']

  if (nonDepsSummary === 'Yes') {
    res.redirect(`${baseUrl}/non-deps-member-category-loop`)
  } else {
    res.redirect(`${baseUrl}/benefit-UC-Carer`)
  }
})


router.post(`${baseUrl}/home-care-home-route-check-router`, (req, res) => {
  const careHomeRouteCheck = req.session.data['home-care-home-route-check']

  if (careHomeRouteCheck === 'Yes') {
    res.redirect(`${baseUrl}/benefit-UC-Carer`)
  } else {
    res.redirect(`${baseUrl}/home-responsible-CTR-HB`)
  }
})

router.post(`${baseUrl}/home-care-home-check-router`, (req, res) => {
  const careHomeCheck = req.session.data['home-care-home-check']

  if (careHomeCheck === 'Yes') {
    res.redirect(`${baseUrl}/home-care-home-funding`)
  } else {
    res.redirect(`${baseUrl}/address-post-code-lookup`)
  }
})




// Home ownership router (home-property-charges)

router.post(`${baseUrl}/home-ownership-router`, (req, res) => {
  const homeOwnership = req.session.data['home-ownership']

  if (homeOwnership === 'You own it') { // Looking for this checked data
    res.redirect(`${baseUrl}/home-own-service-charges`) // If it finds it it does here
  }
  else if (homeOwnership === 'You rent it') {
    res.redirect(`${baseUrl}/home-rent-ground-rent`)
  }
  else if (homeOwnership === 'Shared ownership') {
    res.redirect(`${baseUrl}/home-shared-ground-rent`)
  }
  else if (homeOwnership === 'You live in a caravan houseboat or mobile home') {
    res.redirect(`${baseUrl}/home-moving-homes-ownership`)
  }
  else if (homeOwnership === 'Live in someone elses home') {
    res.redirect(`${baseUrl}/benefit-UC-Carer`)
  }
  else if (homeOwnership === 'Other accommodation') {
    res.redirect(`${baseUrl}/home-other-service-charges`)
  }
  else {
    res.redirect(`${baseUrl}/blank`) // If nothing is selected it will go here.
  }
})

// Home ownership router: RENT

router.post(`${baseUrl}/home-rent-ground-rent-router`, (req, res) => { // When the button is pressed it looks for this router
  const homeRentGroundRent = req.session.data['home-rent-ground-rent'] // The router is looking for this ID.

  if (homeRentGroundRent === 'Yes') {
    res.redirect(`${baseUrl}/home-rent-21-years`)
  } else {
    res.redirect(`${baseUrl}/home-rent-housing-benefit`)
  }
})

router.post(`${baseUrl}/home-rent-housing-benefit-router`, (req, res) => { // When the button is pressed it looks for this router
  const homeRentHousingBenefit = req.session.data['home-rent-housing-benefit'] // The router is looking for this ID.

  if (homeRentHousingBenefit === 'Yes HB') {
    res.redirect(`${baseUrl}/non-deps-living-with-you`)
  } else {
    res.redirect(`${baseUrl}/home-rent-housing-benefit-apply`)
  }
})


// Home ownership router: SHARED

router.post(`${baseUrl}/home-shared-ground-rent-router`, (req, res) => { // When the button is pressed it looks for this router
  const homeSharedGroundRent = req.session.data['home-shared-ground-rent'] // The router is looking for this ID.

  if (homeSharedGroundRent === 'Yes') {
    res.redirect(`${baseUrl}/home-shared-21-years`)
  } else {
    res.redirect(`${baseUrl}/home-mortgage`)
  }
})


router.post(`${baseUrl}/home-shared-housing-benefit-router`, (req, res) => { // When the button is pressed it looks for this router
  const homeSharedHousingBenefit = req.session.data['home-shared-housing-benefit'] // The router is looking for this ID.

  if (homeSharedHousingBenefit === 'Yes HB') {
    res.redirect(`${baseUrl}/non-deps-living-with-you`)
  } else {
    res.redirect(`${baseUrl}/home-rent-housing-benefit-apply`)
  }
})



// Home ownership router: OWNS


router.post(`${baseUrl}/home-mortgage-router`, (req, res) => {
  const hasMortgage = req.session.data['home-mortgage']

  if (hasMortgage === 'Yes') {
    res.redirect(`${baseUrl}/home-smi-check`)
  } else {
    res.redirect(`${baseUrl}/home-equity-release`)
  }
})



router.post(`${baseUrl}/home-smi-check-router`, (req, res) => {
  const smiCheck = req.session.data['home-smi-check']

  if (smiCheck === 'Yes') {
    res.redirect(`${baseUrl}/home-mortgage-home-loan`)
  } else {
    res.redirect(`${baseUrl}/home-equity-release`)
  }
})




router.post(`${baseUrl}/own-mortgage-home-loan-yn-router`, (req, res) => {
  const hasMortgageHomeLoan = req.session.data['own-mortgage-home-loan-yn']

  if (hasMortgageHomeLoan === 'Yes') {
    res.redirect(`${baseUrl}/own-mortgage-home-loan-yes`)
  } else {
    res.redirect(`${baseUrl}/own-council-tax-yn`)
  }
})


router.post(`${baseUrl}/own-mortgage-yn-router`, (req, res) => {
  const hasMortgage = req.session.data['own-mortgage-yn']

  if (hasMortgage === 'Yes') {
    res.redirect(`${baseUrl}/own-mortgage-home-loan-yes`)
  } else {
    res.redirect(`${baseUrl}/own-home-loan-yn`)
  }
})



router.post(`${baseUrl}/own-home-loan-yn-router`, (req, res) => {
  const hasMortgage = req.session.data['own-home-loan-yn']

  if (hasMortgage === 'Yes') {
    res.redirect(`${baseUrl}/own-mortgage-home-loan-yes`)
  } else {
    res.redirect(`${baseUrl}/own-council-tax-yn`)
  }
})



router.post(`${baseUrl}/own-council-tax-yn-router`, (req, res) => { // router name

  const rentCouncilTaxApply = req.session.data['own-council-tax-yn']  // name of data / id name

  if (rentCouncilTaxApply === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/pensions-overview`)
  } else {
    res.redirect(`${baseUrl}/own-council-tax-apply`)
  }
})

// Home ownership router: MOVING HOMES


router.post(`${baseUrl}/home-moving-homes-ownership-router`, (req, res) => {
  const movingHomesOwnership = req.session.data['home-moving-homes-ownership']

  if (movingHomesOwnership === 'Own') {
    res.redirect(`${baseUrl}/home-mortgage`)
  } else {
    res.redirect(`${baseUrl}/home-rent-housing-benefit`)
  }
})



// Home ownership router: OTHER


router.post(`${baseUrl}/home-other-housing-benefit-router`, (req, res) => { // When the button is pressed it looks for this router
  const homeOtherHousingBenefit = req.session.data['home-other-housing-benefit'] // The router is looking for this ID.

  if (homeOtherHousingBenefit === 'Yes HB') {
    res.redirect(`${baseUrl}/non-deps-living-with-you`)
  } else {
    res.redirect(`${baseUrl}/home-other-housing-benefit-apply`)
  }
})


router.post(`${baseUrl}/still-employed-router`, (req, res) => {
  const stillEmployed = req.session.data['still-employed']

  if (stillEmployed === 'yes') {
    res.redirect(`${baseUrl}/employment-type`)
  } else {
    res.redirect(`${baseUrl}/earnings-summary`)
  }
})




router.post(`${baseUrl}/existing-claim-router`, (req, res) => {
  const existingClaim = req.session.data['existing-claim']

  if (existingClaim === 'Yes') {
    res.redirect(`${baseUrl}/task-list`)
  } else {
    res.redirect(`${baseUrl}/over-spa`)
  }
})

router.post(`${baseUrl}/can-contact-router`, (req, res) => {
  const mobile = req.session.data['mobile']

  if (mobile) {
    res.redirect(`${baseUrl}/can-text`)
  } else {
    res.redirect(`${baseUrl}/disability`)
  }
})

router.post(`${baseUrl}/anyone-living-with-you-router`, (req, res) => {
  const peopleInHome = req.session.data['people-in-home']

  if (peopleInHome === 'Yes') {
    res.redirect(`${baseUrl}/notepad-household-composition`)
  } else {
    res.redirect(`${baseUrl}/household-summary`)
  }
})


router.post(`${baseUrl}/pre-declaration-router`, (req, res) => {
  const preDeclaration = req.session.data['pre-declaration']

  if (preDeclaration === 'Yes') {
    res.redirect(`${baseUrl}/reside-in-uk`)
  } else {
    res.redirect(`${baseUrl}/done-declaration`)
  }
})

router.post(`${baseUrl}/rent-charges-service-router`, (req, res) => {// router name
  const rentServiceCharges = req.session.data['rent-service-charges'] // name of data / id name

  if (rentServiceCharges === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/who-is-caller`)
  } else {
    res.redirect(`${baseUrl}/out-decaration`)
  }
})

router.post(`${baseUrl}/privacy-policy-router`, (req, res) => { // router name
  const privacyPolicy = req.session.data['agrees-privacy']  // name of data / id name

  if (privacyPolicy === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/pre-declaration`)
  } else {
    res.redirect(`${baseUrl}/done-privacy-policy`)
  }
})

router.post(`${baseUrl}/otherIncome-router`, (req, res) => { // router name

  const otherIncome = req.session.data['other-Income']  // name of data / id name

  if (otherIncome === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/notepad-otherIncome`)
  } else {
    res.redirect(`${baseUrl}/earnings-and-other-summary`)
  }
})

router.post(`${baseUrl}/type-of-account-router`, (req, res) => { // router name

  const accountType = req.session.data['account-type']  // name of data / id name

  if (accountType === 'UK bank account') { // name of data / + answer
    res.redirect(`${baseUrl}/uk-account`) // forward page
  }
  else if (accountType === 'State Pension account (Via PTPCam)') {
    res.redirect(`${baseUrl}/bank-account-summary`)
  }
  else if (accountType === 'International bank account') {
    res.redirect(`${baseUrl}/international-account`)
  }
})

router.post(`${baseUrl}/claim-date-router`, (req, res) => { // router name
  const claimDate = req.session.data['claim-date']

  if (claimDate === 'Alternative date') {
    req.session.data['claim-date'] =
      data['alternate-date-day'] + ' ' +
      getMonth(data['alternate-date-month']) + ' ' +
      data['alternate-date-year']
  }

  res.redirect(`${baseUrl}/task-list`)
})

router.post(`${baseUrl}/add-hospital-admission-router`, (req, res) => {
  const hostpitalStays = req.session.data['hospital-stays'] || []
  const newStay = makeAStay(req.session.data)

  hostpitalStays.push(newStay)
  req.session.data['hospital-stays'] = hostpitalStays

  res.redirect(`${baseUrl}/notepad-hospital-dates`)
})

router.get(`${baseUrl}/change-hospital-admission/:stayId`, (req, res) => {
  const {stayId} = req.params
  const stay = req.session.data['hospital-stays'][stayId]
  const admissionDate = new Date(stay.admission)
  const dischargeDate = new Date(stay.discharge)
  const admission = {
    day: admissionDate.getDate(),
    month: admissionDate.getMonth() + 1,
    year: admissionDate.getFullYear()
  }
  const discharge = {
    day: dischargeDate.getDate(),
    month: dischargeDate.getMonth() + 1,
    year: dischargeDate.getFullYear()
  }
  res.render(`sprint-6/mvp/change-hospital-admission`, {stayId, admission, discharge})
})

router.post(`${baseUrl}/change-hospital-admission/:stayId`, (req, res) => {
  const {stayId} = req.params
  const hostpitalStays = req.session.data['hospital-stays'] || []
  const newStay = makeAStay(req.session.data)

  hostpitalStays[stayId] = newStay
  req.session.data['hospital-stays'] = hostpitalStays

  res.redirect(`${baseUrl}/notepad-hospital-dates`)
})


router.post(`${baseUrl}/hospital-to-carehome-router`, (req, res) => { // router name
  const hospitalToCareHome = req.session.data['hospital-admission-next']  // name of data / id name

  if (hospitalToCareHome === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/notepad-hospital-to-carehome`)
  } else {
    res.redirect(`${baseUrl}/hospital-summary`)
  }
})




router.post(`${baseUrl}/pension-foreign-check-router`, (req, res) => {
  const pensionForeignCheck = req.session.data['pension-foreign-check']

  if (pensionForeignCheck === 'Yes') {
    res.redirect(`${baseUrl}/pension-foreign-drawdown`)
  } else {
    res.redirect(`${baseUrl}/pension-check`)
  }
})

router.post(`${baseUrl}/pension-foreign-drawdown-router`, (req, res) => {
  const pensionForeignDrawDownCheck = req.session.data['pension-foreign-drawdown']

  if (pensionForeignDrawDownCheck === 'No') {
    res.redirect(`${baseUrl}/pension-foreign-prompt`)
  } else {
    res.redirect(`${baseUrl}/pension-check`)
  }
})


router.post(`${baseUrl}/pension-check-router`, (req, res) => {
  const pensionCheck = req.session.data['pension-check']

  if (pensionCheck === 'Yes') {
    res.redirect(`${baseUrl}/pension-drawdown`)
  } else {
    res.redirect(`${baseUrl}/employment-other-money`)
  }
})

router.post(`${baseUrl}/pension-drawdown-router`, (req, res) => {
  const pensionDrawDownCheck = req.session.data['pension-drawdown']

  if (pensionDrawDownCheck === 'No') {
    res.redirect(`${baseUrl}/pension-prompt`)
  } else {
    res.redirect(`${baseUrl}/employment-other-money`)
  }
})




// Money Savining and investement Routers


router.post(`${baseUrl}/money-total-eed-router`, (req, res) => {
  const moneyTotalEED = req.session.data['money-total-eed']

  if (moneyTotalEED === 'High') {
    res.redirect(`${baseUrl}/money-total-eed`)
  }
  // startCheckArr includes 'money'
  if (moneyTotalEED === '10') {
    res.redirect(`${baseUrl}/money-total-eed-confirm`)
  }
  else {
    res.redirect(`${baseUrl}/money-total-now`)
  }
})

router.post(`${baseUrl}/money-total-now-router`, (req, res) => {
  const moneyTotalNow = req.session.data['money-total-now']

  if (moneyTotalNow === 'High') {
    res.redirect(`${baseUrl}/money-total-risk-check`)
  }
  // startCheckArr includes 'money'
  if (moneyTotalNow === '10') {
    res.redirect(`${baseUrl}/money-total-now-confirm`)
  }
  else {
    res.redirect(`${baseUrl}/money-second-property`)
  }
})



router.post(`${baseUrl}/money-total-risk-check-router`, (req, res) => {
  const riskCheck = req.session.data['money-total-risk-check']
  const riskCheckArr = Array.isArray(riskCheck) ? riskCheck : [riskCheck]
  // startCheckArr includes both 'ni' and 'money'
  if (riskCheckArr.includes('Low') && riskCheckArr.includes('High')) {
    res.redirect(`${baseUrl}/money-risk-notification`)
  }
  // startCheckArr includes 'ni'
  else if (riskCheckArr.includes('Low')) {
    res.redirect(`${baseUrl}/money-second-property`)
  }
  // startCheckArr includes 'money'
  else if (riskCheckArr.includes('High')) {
    res.redirect(`${baseUrl}/money-risk-notification`)
  }
  // startCheckArr includes neither 'money' or 'ni'
  else {
    res.redirect(`${baseUrl}/money-second-property`)
  }
})

router.post(`${baseUrl}/money-total-eed-confirm-router`, (req, res) => {
  const moneyTotalEEDConfirm = req.session.data['money-total-eed-confirm']

  if (moneyTotalEEDConfirm === 'Yes') {
    res.redirect(`${baseUrl}/money-total-now`)
  } else {
    res.redirect(`${baseUrl}/money-total-eed`)
  }
})

router.post(`${baseUrl}/money-total-now-confirm-router`, (req, res) => {
  const moneyTotalNowConfirm = req.session.data['money-total-now-confirm']

  if (moneyTotalNowConfirm === 'Yes') {
    res.redirect(`${baseUrl}/money-total-risk-check`)
  } else {
    res.redirect(`${baseUrl}/money-total-now`)
  }
})

// [2] Money Savining and investement Routers

router.post(`${baseUrl}/money-2-total-now-router`, (req, res) => {
  const money2TotalNow = req.session.data['money-2-total-now']

  if (money2TotalNow === '£7,000 to £10,000') {
    res.redirect(`${baseUrl}/money-2-total-eed-same-check`)
  }
  // startCheckArr includes 'money'
  if (money2TotalNow === '10') {
    res.redirect(`${baseUrl}/money-2-total-now-confirm`)
  }
  else {
    res.redirect(`${baseUrl}/money-2-total-eed-same-check`)
  }
})

router.post(`${baseUrl}/money-2-total-now-confirm-router`, (req, res) => {
  const money2TotalNowConfirm = req.session.data['money-2-total-now-confirm']

  if (money2TotalNowConfirm === 'Yes') {
    res.redirect(`${baseUrl}/money-2-total-eed`)
  } else {
    res.redirect(`${baseUrl}/money-2-total-now`)
  }
})

router.post(`${baseUrl}/money-2-total-eed-same-check-7-router`, (req, res) => {
  const money2TotalEEDSameCheck7 = req.session.data['money-2-total-eed-same-check']

  if (money2TotalEEDSameCheck7=== 'Yes') {
    res.redirect(`${baseUrl}/money-second-property`)
  } else {
    res.redirect(`${baseUrl}/money-2-total-eed`)
  }
})

router.post(`${baseUrl}/money-2-total-eed-same-check-10-router`, (req, res) => {
  const money2TotalEEDSameCheck10 = req.session.data['money-2-total-eed-same-check']

  if (money2TotalEEDSameCheck10=== 'Yes') {
    res.redirect(`${baseUrl}/money-total-risk-check`)
  } else {
    res.redirect(`${baseUrl}/money-2-total-eed`)
  }
})

router.post(`${baseUrl}/money-2-total-eed-confirm-router`, (req, res) => {
  const money2TotalEEDConfirm = req.session.data['money-2-total-eed-confirm']

  if (money2TotalEEDConfirm === 'Yes') {
    res.redirect(`${baseUrl}/money-total-risk-check`)
  } else {
    res.redirect(`${baseUrl}/money-2-total-eed`)
  }
})

router.post(`${baseUrl}/money-2-total-eed-router`, (req, res) => {
  const money2TotalEED = req.session.data['money-2-total-eed']

  if (money2TotalEED === 'High') {
    res.redirect(`${baseUrl}/money-total-risk-check`)
  }
  // startCheckArr includes 'money'
  if (money2TotalEED === '10') {
    res.redirect(`${baseUrl}/money-2-total-eed-confirm`)
  }
  else {
    res.redirect(`${baseUrl}/money-second-property`)
  }
})







router.post(`${baseUrl}/money-bonds-router`, (req, res) => {
  const moneyBondsRouter = req.session.data['money-bonds']

  if (moneyBondsRouter === 'Yes') {
    res.redirect(`${baseUrl}/money-bonds-assurance`)
  } else {
    res.redirect(`${baseUrl}/money-second-property`)
  }
})

router.post(`${baseUrl}/disregards-types-router`, (req, res) => {
  const disregardsRouter = req.session.data['disregards-type-select']

  if (disregardsRouter === 'No') {
    res.redirect(`${baseUrl}/disregards-summary`)
  } else {
    res.redirect(`${baseUrl}/disregards-types-all`)
  }
})



router.post(`${baseUrl}/money-second-property-router`, (req, res) => {
  const moneySecondProperty = req.session.data['money-second-property-check']

  if (moneySecondProperty === 'Yes') {
    res.redirect(`${baseUrl}/money-disregards-all`)
  } else {
    res.redirect(`${baseUrl}/hrt-claimant-immigration-restrictions`)
  }
})



router.post(`${baseUrl}/money-disregards-all-router`, (req, res) => {
  const nonDepsCheck = req.session.data['money-disregards-all']

  if (nonDepsCheck === 'No') {
    res.redirect(`${baseUrl}/money-disregards-payments`)
  } else {
    res.redirect(`${baseUrl}/hrt-claimant-immigration-restrictions`)
  }
})


// disregards END


router.post(`${baseUrl}/other-income-employment-yn-router`, (req, res) => {
  const employmentFulltime = req.session.data['other-income-employment-yn']

  if (employmentFulltime === 'Yes') {
    res.redirect(`${baseUrl}/other-income-employment-type`)
  } else {
    res.redirect(`${baseUrl}/other-income-equity-release-yn`)
  }
})



router.post(`${baseUrl}/other-income-employment-type-router`, (req, res) => {
  const employmentType = req.session.data['other-income-employment-type']

  if (employmentType === 'Self-employment') {
    res.redirect(`${baseUrl}/other-income-self-employment-yes`)
  }
  else if (employmentType === 'Employed') {
    res.redirect(`${baseUrl}/other-income-employment-yes`)
  }
  else if (employmentType === 'Both employed and self-employment') {
    res.redirect(`${baseUrl}/other-income-employment-yes`)
  }
   else {
    res.redirect(`${baseUrl}/other-income-self-employment-yes`)
  }
})


router.post(`${baseUrl}/other-income-self-employment-yn-router`, (req, res) => {
  const employmentFulltime = req.session.data['other-income-self-employment-yn']

  if (employmentFulltime === 'Yes') {
    res.redirect(`${baseUrl}/other-income-self-employment-yes`)
  } else {
    res.redirect(`${baseUrl}/other-income-equity-release-yn`)
  }
})

router.post(`${baseUrl}/other-income-employment-yn-router`, (req, res) => {
  const otherIncomeEmployment = req.session.data['other-income-employment-yn']

  if (otherIncomeEmployment === 'Yes') {
    res.redirect(`${baseUrl}/other-income-employment-yes`)
  } else {
    res.redirect(`${baseUrl}/other-income-aboard-yn`)
  }
})



router.post(`${baseUrl}/other-income-benefits-aboard-yn-router`, (req, res) => {
  const otherIncomesickPayYN = req.session.data['other-income-benefits-aboard-yn']

  if (otherIncomesickPayYN === 'Yes') {
    res.redirect(`${baseUrl}/other-income-benefits-aboard-yes`)
  } else {
    res.redirect(`${baseUrl}/other-income-aboard-yn`)
  }
})




router.post(`${baseUrl}/other-income-equity-release-yn-router`, (req, res) => {
  const otherIncomeequityReleaseYN = req.session.data['other-income-equity-release-yn']

  if (otherIncomeequityReleaseYN === 'Yes') {
    res.redirect(`${baseUrl}/other-income-home-income-yn`)
  } else {
    res.redirect(`${baseUrl}/other-income-everything-else-yes`)
  }
})

router.post(`${baseUrl}/other-income-home-income-yn-router`, (req, res) => {
  const otherIncomeEverythingElse = req.session.data['other-income-home-income-yn']

  if (otherIncomeEverythingElse === 'Yes') {
    res.redirect(`${baseUrl}/other-income-everything-else-yes`)
  } else {
    res.redirect(`${baseUrl}/other-income-equity-release-yes`)
  }
})



router.post(`${baseUrl}/benefits-working-tax-credits-yn-router`, (req, res) => {
  const otherIncomeworkingTaxCreditsYN = req.session.data['benefits-working-tax-credits-yn']

  if (otherIncomeworkingTaxCreditsYN === 'Yes') {
    res.redirect(`${baseUrl}/benefits-working-tax-credits-yes`)
  } else {
    res.redirect(`${baseUrl}/benefits-war-disablement-yn`)
  }
})


router.post(`${baseUrl}/other-income-sick-pay-yn-router`, (req, res) => {
  const otherIncomesickPayYN = req.session.data['other-income-sick-pay-yn']

  if (otherIncomesickPayYN === 'Yes') {
    res.redirect(`${baseUrl}/other-income-sick-pay-yes`)
  } else {
    res.redirect(`${baseUrl}/other-income-royalties-yn`)
  }
})



router.post(`${baseUrl}/other-income-royalties-yn-router`, (req, res) => {
  const otherIncomeequityReleaseYN = req.session.data['other-income-royalties-yn']

  if (otherIncomeequityReleaseYN === 'Yes') {
    res.redirect(`${baseUrl}/other-income-royalties-yes`)
  } else {
    res.redirect(`${baseUrl}/other-income-equity-release-yn`)
  }
})



router.post(`${baseUrl}/other-income-everything-else-yn-router`, (req, res) => {
  const otherIncomeEverythingElse = req.session.data['other-income-everything-else-yn']

  if (otherIncomeEverythingElse === 'Yes') {
    res.redirect(`${baseUrl}/other-income-everything-else-yes`)
  } else {
    res.redirect(`${baseUrl}/other-income-summary`)
  }
})






// Other Income END


router.post(`${baseUrl}/disregards-capital-total-yn-router`, (req, res) => {
  const hasSecondProperty = req.session.data['disregards-capital-total-yn']

  if (hasSecondProperty === 'Yes') {
    res.redirect(`${baseUrl}/disregards-benefit-check-yn`)
  } else {
    res.redirect(`${baseUrl}/disregards-summary`)
  }
})

router.post(`${baseUrl}/disregards-type-more-yn-router`, (req, res) => {
  const hasSecondProperty = req.session.data['disregards-type-select']

  if (disregardsSelect === 'None') {
    res.redirect(`${baseUrl}/disregards-type-more-yn`)
  } else {
    res.redirect(`${baseUrl}/disregards-summary`)
  }
})

router.post(`${baseUrl}/disregards-types-yn-router`, (req, res) => {
  const disregardsTypes = req.session.data['disregards-types-yn']

  if (disregardsTypes === 'Yes') {
    res.redirect(`${baseUrl}/disregards-entry`)
  } else {
    res.redirect(`${baseUrl}/disregards-summary`)
  }
})


router.post(`${baseUrl}/disregards-type-select-router`, (req, res) => {
  const disregardsSelect = req.session.data['disregards-types-all']

  if (disregardsSelect === 'None') {
    res.redirect(`${baseUrl}/disregards-type-more-yn`)
  } else {
    res.redirect(`${baseUrl}/disregards-entry`)
  }
})


router.post(`${baseUrl}/pc-done-yn-router`, (req, res) => { // router name
  const pcDoneYn = req.session.data['pc-done-yn']  // name of data / id name

  if (pcDoneYn === 'Agree') { // name of data / + answer
    res.redirect(`${baseUrl}/pc-done-yn`)
  } else {
    res.redirect(`${baseUrl}/done-declaration`)
  }
})

router.post(`${baseUrl}/index-survey-router`, (req, res) => { // router name
  const indexSurveyYN = req.session.data['index-survey-yn']  // name of data / id name

  if (indexSurveyYN === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}getinvolved.dwp.gov.uk/++preview++/digital/fa743129`)
  } else {
    res.redirect(`${baseUrl}/start`)
  }
})



// HRT ROUTING



router.post(`${baseUrl}/hrt-check-router`, (req, res) => { // router name
  const hrtCheck = req.session.data['hrt-check']  // name of data / id name

  if (hrtCheck === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/hrt-claimant-immigration-restrictions`)
  } else {
    res.redirect(`${baseUrl}/del-auth-who-made-claim`)
  }
})

router.post(`${baseUrl}/hrt-check-router`, (req, res) => { // router name
  const hrtCheck = req.session.data['hrt-check']  // name of data / id name

  if (hrtCheck === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/hrt-claimant-immigration-restrictions`)
  } else {
    res.redirect(`${baseUrl}/del-auth-who-made-claim`)
  }
})


router.post(`${baseUrl}/hrt-claimant-permanently-in-UK-router`, (req, res) => { // router name
  const claimantPermanentlyInUK = req.session.data['hrt-claimant-permanently-in-UK']  // name of data / id name

  if (claimantPermanentlyInUK === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/del-auth-who-made-claim`)
  } else {
    res.redirect(`${baseUrl}/hrt-claimant-returned-to-uk`)
  }
})

router.post(`${baseUrl}/hrt-claimant-returned-to-uk-router`, (req, res) => { // router name
  const claimantReturnedToUK = req.session.data['hrt-claimant-returned-to-uk']  // name of data / id name

  if (claimantReturnedToUK === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/hrt-nationality-details`)
  } else {
    res.redirect(`${baseUrl}/hrt-uk-sponsorship`)
  }
})

router.post(`${baseUrl}/hrt-partner-permanently-in-UK-router`, (req, res) => { // router name
  const partnerPermanentlyInUK = req.session.data['hrt-partner-permanently-in-UK']  // name of data / id name

  if (partnerPermanentlyInUK === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/del-auth-who-made-claim`)
  } else {
    res.redirect(`${baseUrl}/hrt-partner-returned-to-uk`)
  }
})




router.post(`${baseUrl}/hrt-uk-sponsorship-router`, (req, res) => { // router name
  const ukSponsorshipCheck = req.session.data['hrt-uk-sponsorship']  // name of data / id name

  if (ukSponsorshipCheck === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/hrt-sponsorship-details`)
  } else {
    res.redirect(`${baseUrl}/hrt-asylum-seeker`)
  }
})

router.post(`${baseUrl}/hrt-asylum-seeker-router`, (req, res) => { // router name
  const hrtAsylumSeeker = req.session.data['hrt-asylum-seeker']  // name of data / id name

  if (hrtAsylumSeeker === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/hrt-asylum-details`)
  } else {
    res.redirect(`${baseUrl}/hrt-partner-check`)
  }
})

// HRT PARTNER ROUTING

router.post(`${baseUrl}/hrt-partner-check-router`, (req, res) => { // router name
  const partnerCheck = req.session.data['hrt-partner-check']  // name of data / id name

  if (partnerCheck === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/hrt-partner-immigration-restrictions`)
  } else {
    res.redirect(`${baseUrl}/del-auth-who-made-claim`)
  }
})

router.post(`${baseUrl}/hrt-partner-returned-to-uk-router`, (req, res) => { // router name
  const partnerReturnedToUK = req.session.data['hrt-partner-returned-to-uk']  // name of data / id name

  if (partnerReturnedToUK === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/hrt-partner-nationality-details`)
  } else {
    res.redirect(`${baseUrl}/hrt-partner-uk-sponsorship`)
  }
})

router.post(`${baseUrl}/hrt-partner-uk-sponsorship-router`, (req, res) => { // router name
  const partnerUKSponsorshipCheck = req.session.data['hrt-partner-uk-sponsorship']  // name of data / id name

  if (partnerUKSponsorshipCheck === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/hrt-partner-sponsorship-details`)
  } else {
    res.redirect(`${baseUrl}/hrt-partner-asylum-seeker`)
  }
})

router.post(`${baseUrl}/hrt-partner-asylum-seeker-router`, (req, res) => { // router name
  const hrtPartnerAsylumSeeker = req.session.data['hrt-partner-asylum-seeker']  // name of data / id name

  if (hrtPartnerAsylumSeeker === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/hrt-partner-asylum-details`)
  } else {
    res.redirect(`${baseUrl}/del-auth-who-made-claim`)
  }
})

// Help to make the claim

router.post(`${baseUrl}/del-auth-who-check-router`, (req, res) => {
  const singleJoint = req.session.data['del-auth-who-check']

  if (singleJoint === 'Yourself') {
    res.redirect(`${baseUrl}/del-auth-address-correspondence-yn`)
  } else {
    res.redirect(`${baseUrl}/del-auth-address-correspondence-post-code-lookup`)
  }
})





router.post(`${baseUrl}/del-auth-address-correspondence-yn-router`, (req, res) => { // router name
  const correspondenceYN = req.session.data['del-auth-address-correspondence-yn']  // name of data / id name

  if (correspondenceYN === 'A different address') { // name of data / + answer
    res.redirect(`${baseUrl}/del-auth-address-correspondence-post-code-lookup`)
  } else {
    res.redirect(`${baseUrl}/del-auth-email-confirmation`)
  }
})


router.post(`${baseUrl}/del-auth-who-made-claim-router`, (req, res) => { // router name
  const whoMadeClaim = req.session.data['del-auth-who-made-claim']  // name of data / id name

  if (whoMadeClaim === 'Yourself') { // name of data / + answer
    res.redirect(`${baseUrl}/del-auth-contact-number`)
  }
  else if (whoMadeClaim === 'Power of attorney') { // name of data / + answer
    res.redirect(`${baseUrl}/del-auth-contact-name`)
  }
  else if (whoMadeClaim === 'Appointee') { // name of data / + answer
    res.redirect(`${baseUrl}/del-auth-contact-name`)
  }
  else if (whoMadeClaim === 'Personal Acting Body') { // name of data / + answer
    res.redirect(`${baseUrl}/del-auth-contact-name`)
  }
  else if (whoMadeClaim === 'Corporate Acting Body') { // name of data / + answer
    res.redirect(`${baseUrl}/del-auth-contact-name`)
  }
  else if (whoMadeClaim === 'Charity or organisation') { // name of data / + answer
    res.redirect(`${baseUrl}/del-auth-contact-number`)
  }
  else if (whoMadeClaim === 'Friend or family member') { // name of data / + answer
    res.redirect(`${baseUrl}/del-auth-contact-ff-number-check`)
  }
  else if (whoMadeClaim === 'Someone else') { // name of data / + answer
    res.redirect(`${baseUrl}/del-auth-contact-number`)
  }
  else {
    res.redirect(`${baseUrl}/del-auth-contact-number`)
  }
})




router.post(`${baseUrl}/del-auth-contact-ff-number-check-router`, (req, res) => {
  const whoMadeClaimNumberCheck = req.session.data['del-auth-contact-ff-number-check']

  if (whoMadeClaimNumberCheck === 'Phone the applicant') {
    res.redirect(`${baseUrl}/del-auth-contact-language`)
  }
  else if (whoMadeClaimNumberCheck === 'Phone someone else') {
    res.redirect(`${baseUrl}/del-auth-contact-ff-name-number`)
  }
   else {
    res.redirect(`${baseUrl}/del-auth-contact-letter-language`)
  }
})


router.post(`${baseUrl}/index-made-claim-letter-check-router`, (req, res) => { // router name
  const helpToClaim = req.session.data['index-made-claim-letter-check']  // name of data / id name

  if (helpToClaim === 'No - send letters to a different address') { // name of data / + answer
    res.redirect(`${baseUrl}/index-help-address-correspondence-post-code-lookup`)
  } else {
    res.redirect(`${baseUrl}/del-auth-email-confirmation`)
  }
})


router.post(`${baseUrl}/del-auth-contact-call-formats-check-router`, (req, res) => {
  const contactCallFormats = req.session.data['del-auth-contact-call-formats-check']

  if (contactCallFormats === 'Yes') {
    res.redirect(`${baseUrl}/del-auth-contact-call-formats`)
  } else {
    res.redirect(`${baseUrl}/del-auth-contact-letter-language`)
  }
})

router.post(`${baseUrl}/del-auth-contact-letter-formats-check-router`, (req, res) => {
  const contactLetterFormats = req.session.data['del-auth-contact-letter-formats-check']

  if (contactLetterFormats === 'Yes') {
    res.redirect(`${baseUrl}/del-auth-contact-letter-formats`)
  } else {
    res.redirect(`${baseUrl}/del-auth-who-check`)
  }
})







module.exports = router
