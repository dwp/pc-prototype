const express = require('express')
const { getStatePensionDate } = require('get-state-pension-date')
const differenceInDays = require('date-fns/differenceInDays')
const startOfDay = require('date-fns/startOfDay')
const subMonths = require('date-fns/subMonths')
const got = require('got')
const fs = require('fs')
const {getMonth} = require('../../filters')()

const router = new express.Router()
const baseUrl = '/citizen-version-1-1/mvp'

function makeAStay(data) {
  const admission = new Date(`${data['admission-year']}-${data['admission-month']}-${data['admission-day']}`)
  const discharge = new Date(`${data['discharge-year']}-${data['discharge-month']}-${data['discharge-day']}`)
  const totalDays = Math.max(differenceInDays(discharge, admission) - 1, 0)
  return {admission, discharge, totalDays}
}






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

router.post(`${baseUrl}/address-correspondence-yn-router`, (req, res) => { // router name
  const correspondenceYN = req.session.data['address-correspondence-yn']  // name of data / id name

  if (correspondenceYN === 'No - I live at a different address') { // name of data / + answer
    res.redirect(`${baseUrl}/address-correspondence-post-code-lookup`)
  } else {
    res.redirect(`${baseUrl}/home-living-with-you`)
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



router.post(`${baseUrl}/contact-formats-router`, (req, res) => {
  const contactFormats = req.session.data['contact-formats'] || []

  if (contactFormats.includes('Letters by email') === true) {
    res.redirect(`${baseUrl}/contact-email`)
  }
  else {
    res.redirect(`${baseUrl}/address-correspondence-yn`)
  }
})




router.post(`${baseUrl}/contact-email-check-router`, (req, res) => {
  const emailCheck = req.session.data['contact-email-check-yn']

  if (emailCheck === 'Yes') {
    res.redirect(`${baseUrl}/contact-formats`)
  } else {
    res.redirect(`${baseUrl}/address-correspondence-yn`)
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
    res.redirect(`${baseUrl}/partner-check-yn`)
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

  if (residesInUk === 'Yes') {
    res.redirect(`${baseUrl}/nationality-check`)
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
    res.redirect(`${baseUrl}/reside-in-uk`)
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
  const childrenCheck = req.session.data['partner-check-yn']

  if (childrenCheck === 'No') {
    res.redirect(`${baseUrl}/claim-date-of-claim`)
  } else {
    res.redirect(`${baseUrl}/partner-app-check`)
  }
})

router.post(`${baseUrl}/claim-filter-router`, (req, res) => {
  const claimFilter = req.session.data['claim-filter']

  if (claimFilter === 'Normal') {
    res.redirect(`${baseUrl}/claim-date-of-claim`)
  } else {
    res.redirect(`${baseUrl}/claim-notification`)
  }
})



router.post(`${baseUrl}/partner-mac-yn-router`, (req, res) => {
  const childrenCheck = req.session.data['partner-mac-yn']

  if (childrenCheck === 'Yes') {
    res.redirect(`${baseUrl}/partner-app-check`)
  } else {
    res.redirect(`${baseUrl}/done-partner`)
  }
})

router.post(`${baseUrl}/contact-formats-check-router`, (req, res) => {
  const contactFormats = req.session.data['contact-formats-check']

  if (contactFormats === 'Yes') {
    res.redirect(`${baseUrl}/contact-formats`)
  } else {
    res.redirect(`${baseUrl}/home-care-home-check`)
  }
})

router.post(`${baseUrl}/contact-formats-check-joint-router`, (req, res) => {
  const contactFormats = req.session.data['contact-formats-check']

  if (contactFormats === 'Yes') {
    res.redirect(`${baseUrl}/contact-formats`)
  } else {
    res.redirect(`${baseUrl}/partner-details`)
  }
})

router.post(`${baseUrl}/home-care-home-check-router`, (req, res) => {
  const careHome = req.session.data['home-care-home-check']
  const careHomeStillOwn = req.session.data['home-care-home-check-still-own']
  if (careHome === 'Yes' && careHomeStillOwn === 'Yes') {
    res.redirect(`${baseUrl}/pension-check`)
  }
  if (careHome === 'Yes' && careHomeStillOwn === 'No') {
    res.redirect(`${baseUrl}/pension-check`)
  }
  else {
    res.redirect(`${baseUrl}/address-post-code-lookup`)
  }
})



router.post(`${baseUrl}/single-joint-check-router`, (req, res) => {
  const singleJoint = req.session.data['single-joint-check']

  if (singleJoint === 'Single') {
    res.redirect(`${baseUrl}/home-care-home-check`)
  } else {
    res.redirect(`${baseUrl}/partner-details`)
  }
})


router.post(`${baseUrl}/has-work-router`, (req, res) => {
  const hasWork = req.session.data['has-work']

  if (hasWork === 'yes') {
    res.redirect(`${baseUrl}/about-your-employment`)
  } else {
    res.redirect(`${baseUrl}/self-employed`)
  }
})

router.post(`${baseUrl}/self-employed-router`, (req, res) => {
  const selfEmployed = req.session.data['self-employed']

  if (selfEmployed === 'yes') {
    res.redirect(`${baseUrl}/about-your-self-employment`)
  } else {
    res.redirect(`${baseUrl}/other-income`)
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

router.post(`${baseUrl}/home-ownership-router`, (req, res) => {
  const homeOwnership = req.session.data['home-ownership']

  if (homeOwnership === 'You own it') {
    res.redirect(`${baseUrl}/own-property-charges`)
  }
  else if (homeOwnership === 'You rent it') {
    res.redirect(`${baseUrl}/rent-service-charges`)
  }
  else if (homeOwnership === 'Other accommodation') {
    res.redirect(`${baseUrl}/home-shared-payments`)
  }

  res.redirect(`${baseUrl}/XXX`)
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


// Money Savining and investement Routers





router.post(`${baseUrl}/disregards-types-router`, (req, res) => {
  const disregardsRouter = req.session.data['disregards-type-select']

  if (disregardsRouter === 'No') {
    res.redirect(`${baseUrl}/disregards-summary`)
  } else {
    res.redirect(`${baseUrl}/disregards-types-all`)
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

router.post(`${baseUrl}/money-second-property-router`, (req, res) => {
  const hasSecondProperty = req.session.data['money-second-property']

  if (hasSecondProperty === 'Yes') {
    res.redirect(`${baseUrl}/money-disregards-all`)
  } else {
    res.redirect(`${baseUrl}/final-cya`)
  }
})


// HRT ROUTING



router.post(`${baseUrl}/hrt-check-router`, (req, res) => { // router name
  const hrtCheck = req.session.data['hrt-check']  // name of data / id name

  if (hrtCheck === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/hrt-returned-to-uk`)
  } else {
    res.redirect(`${baseUrl}/final-cya`)
  }
})
router.post(`${baseUrl}/hrt-returned-to-uk-router`, (req, res) => { // router name
  const returnedToUK = req.session.data['hrt-returned-to-uk']  // name of data / id name

  if (returnedToUK === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/hrt-nationality-details`)
  } else {
    res.redirect(`${baseUrl}/hrt-uk-sponsorship`)
  }
})




router.post(`${baseUrl}/hrt-uk-sponsorship-router`, (req, res) => { // router name
  const ukSponsorshipCheck = req.session.data['hrt-uk-sponsorship']  // name of data / id name

  if (ukSponsorshipCheck === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/hrt-sponsorship-details`)
  } else {
    res.redirect(`${baseUrl}/hrt-other-details`)
  }
})

// HRT PARTNER ROUTING

router.post(`${baseUrl}/hrt-partner-check-router`, (req, res) => { // router name
  const partnerCheck = req.session.data['hrt-partner-check']  // name of data / id name

  if (partnerCheck === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/hrt-partner-returned-to-uk`)
  } else {
    res.redirect(`${baseUrl}/final-CYA`)
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
    res.redirect(`${baseUrl}/hrt-partner-other-details`)
  }
})







module.exports = router
