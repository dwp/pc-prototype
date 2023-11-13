const express = require('express')
const { getStatePensionDate } = require('get-state-pension-date')
const differenceInDays = require('date-fns/differenceInDays')
const startOfDay = require('date-fns/startOfDay')
const subMonths = require('date-fns/subMonths')
const got = require('got')
const fs = require('fs')
const {getMonth} = require('../../filters')()

const router = new express.Router()
const baseUrl = '/sprint-8/mvp'

function makeAStay(data) {
  const admission = new Date(`${data['admission-year']}-${data['admission-month']}-${data['admission-day']}`)
  const discharge = new Date(`${data['discharge-year']}-${data['discharge-month']}-${data['discharge-day']}`)
  const totalDays = Math.max(differenceInDays(discharge, admission) - 1, 0)
  return {admission, discharge, totalDays}
}


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
    res.redirect(`${baseUrl}/claim-date-options-backdating-outside-out`)
  } else {
    res.redirect(`${baseUrl}/claim-date-options-backdating-changes-yn`)
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
  const claimDateTest = req.session.data['claim-date-manual-eed-daf-yn']

  if (claimDateTest === 'Yes') {
    res.redirect(`${baseUrl}/claim-date-options-backdating-outside-yn`)
  } else {
    res.redirect(`${baseUrl}/claim-date-manual-eed-daf-reason`)
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
    res.redirect(`${baseUrl}/reside-in-uk`)
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
    res.redirect(`${baseUrl}/lived-abroad`)
  } else {
    res.redirect(`${baseUrl}/done-none-uk`)
  }
})

router.post(`${baseUrl}/lived-abroad-router`, (req, res) => {
  const residesInUk = req.session.data['lived-abroad']

  if (residesInUk === 'Yes') {
    res.redirect(`${baseUrl}/uk-national`)
  } else {
    res.redirect(`${baseUrl}/done-lived-abroad-hrt`)
  }
})

router.post(`${baseUrl}/uk-national-router`, (req, res) => {
  const residesInUk = req.session.data['uk-national']

  if (residesInUk === 'Yes') {
    res.redirect(`${baseUrl}/partner-under-spa`)
  } else {
    res.redirect(`${baseUrl}/done-lived-abroad-hrt`)
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
    res.redirect(`${baseUrl}/address-summary`)
  }
})

router.post(`${baseUrl}/home-ownership-router`, (req, res) => {
  const homeOwnership = req.session.data['home-ownership']

  if (homeOwnership === 'You own it') {
    res.redirect(`${baseUrl}/own-service-charges`)
  }
  else if (homeOwnership === 'You rent it') {
    res.redirect(`${baseUrl}/rent-service-charges`)
  }
  else if (homeOwnership === 'You live in someone else\'s home without paying rent') {
    res.redirect(`${baseUrl}/address-summary`)
  }
  else if (homeOwnership === 'You own and rent it (shared ownership)') {
    res.redirect(`${baseUrl}/notepad-shared-ownership`)
  }
  else if (homeOwnership === 'You live in a care home or nursing home') {
    res.redirect(`${baseUrl}/notepad-care-nursing-home`)
  }
  else if (homeOwnership === 'You live in sheltered accommodation') {
    res.redirect(`${baseUrl}/notepad-sheltered`)
  }
  else if (homeOwnership === 'Other accommodation') {
    res.redirect(`${baseUrl}/address-summary`)
  }

  res.redirect(`${baseUrl}/address-summary`)
})



router.post(`${baseUrl}/rent-council-tax-yn-router`, (req, res) => { // router name

  const rentCouncilTaxApply = req.session.data['rent-council-tax-yn']  // name of data / id name

  if (rentCouncilTaxApply === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/rent-housing-benefit-yn`)
  } else {
    res.redirect(`${baseUrl}/rent-council-tax-apply`)
  }
})

router.post(`${baseUrl}/rent-housing-benefit-yn-router`, (req, res) => { // router name

  const rentHousingBenefitApply = req.session.data['rent-housing-benefit-yn']  // name of data / id name

  if (rentHousingBenefitApply === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/address-summary`)
  } else {
    res.redirect(`${baseUrl}/rent-housing-benefit-apply`)
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
    res.redirect(`${baseUrl}/address-summary`)
  } else {
    res.redirect(`${baseUrl}/own-council-tax-apply`)
  }
})




router.post(`${baseUrl}/employment-router`, (req, res) => {
  const employmentFulltime = req.session.data['employment-fulltime']

  if (employmentFulltime === 'yes') {
    res.redirect(`${baseUrl}/notepad-selfEmployment`)
  } else {
    res.redirect(`${baseUrl}/earnings-summary`)
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

router.post(`${baseUrl}/employment-type-router`, (req, res) => {
  const employmentType = req.session.data['employment-type']

  if (employmentType === 'Self employed') {
    res.redirect(`${baseUrl}/add-self-employment`)
  } else if (employmentType === 'Full time employment') {
    res.redirect(`${baseUrl}/add-employment`)
  } else if (employmentType === 'Employed and Self employed') {
    req.session.data.employedAndSelfEmployed = true
    res.redirect(`${baseUrl}/add-employment`)
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

router.post(`${baseUrl}/has-private-pension-router`, (req, res) => {
  const otherPensions = req.session.data['has-private-pension']

  if (otherPensions === 'yes') {
    res.redirect(`${baseUrl}/notepad-otherPensions`)
  } else {
    res.redirect(`${baseUrl}/has-foreign-pension`)
  }
})

router.post(`${baseUrl}/has-foreign-pension-router`, (req, res) => {
  const foreignPension = req.session.data['has-foreign-pension']

  if (foreignPension === 'yes') {
    res.redirect(`${baseUrl}/notepad-foreignPensions`)
  } else {
    res.redirect(`${baseUrl}/all-other-pensions-summary`)
  }
})

router.post(`${baseUrl}/hospital-yn-router`, (req, res) => {
  const hospital = req.session.data['hospital-yn']

  if (hospital === 'Yes') {
    res.redirect(`${baseUrl}/notepad-hospital-dates`)
  } else {
    req.session.data['hospital-yes-complete'] = 'true'
    res.redirect(`${baseUrl}/task-list`)
  }
})

router.post(`${baseUrl}/pre-declaration-router`, (req, res) => {
  const preDeclaration = req.session.data['pre-declaration']

  if (preDeclaration === 'Yes') {
    res.redirect(`${baseUrl}/who-is-caller`)
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


router.post(`${baseUrl}/msic-pc-payment-router`, (req, res) => {
  const hasCurrentAccount = req.session.data['msic-pc-payment']

  if (hasCurrentAccount === 'Same account as State Pension') {
    res.redirect(`${baseUrl}/msic-pc-payment-state-pension-account`)
  } else {
    res.redirect(`${baseUrl}/msic-pc-payment-alternative-account`)
  }
})

router.post(`${baseUrl}/msic-has-current-account-yn-router`, (req, res) => {
  const hasCurrentAccount = req.session.data['msic-has-current-account-yn']

  if (hasCurrentAccount === 'yes') {
    res.redirect(`${baseUrl}/msic-all-current-account`)
  } else {
    res.redirect(`${baseUrl}/msic-has-savings-account-yn`)
  }
})

router.post(`${baseUrl}/msic-all-current-accounts-summary-router`, (req, res) => {
  const addAnother = req.session.data['add-another-current']

  if (addAnother === 'yes') {
    res.redirect(`${baseUrl}/msic-all-current-account`)
  } else {
    res.redirect(`${baseUrl}/msic-has-savings-account-yn`)
  }
});

router.post(`${baseUrl}/msic-has-savings-account-yn-router`, (req, res) => {
  const hasBuildingsCurrentAccount = req.session.data['msic-has-savings-account-yn']

  if (hasBuildingsCurrentAccount === 'yes') {
    res.redirect(`${baseUrl}/msic-all-savings-account`)
  } else {
    res.redirect(`${baseUrl}/msic-has-post-office-card-account-yn`)
  }
})

router.post(`${baseUrl}/msic-has-post-office-card-account-yn-router`, (req, res) => {
  const hasPostOfficeCardAccount = req.session.data['msic-has-post-office-card-account-yn']

  if (hasPostOfficeCardAccount === 'yes') {
    res.redirect(`${baseUrl}/msic-post-office-card-account`)
  } else {
    res.redirect(`${baseUrl}/msic-has-premium-bond-account-yn`)
  }
})


router.post(`${baseUrl}/msic-has-premium-bond-account-yn-router`, (req, res) => {
  const hasPremiumBondAccount = req.session.data['msic-has-premium-bond-account-yn']

  if (hasPremiumBondAccount === 'yes') {
    res.redirect(`${baseUrl}/msic-premium-bond-account`)
  } else {
    res.redirect(`${baseUrl}/msic-has-isa-savings-account-yn`)
  }
})

router.post(`${baseUrl}/msic-has-isa-savings-account-yn-router`, (req, res) => {
  const hasISASavingsAccount = req.session.data['msic-has-isa-savings-account-yn']

  if (hasISASavingsAccount === 'yes') {
    res.redirect(`${baseUrl}/msic-isa-savings-account`)
  } else {
    res.redirect(`${baseUrl}/msic-has-capital-bond-account-yn`)
  }
})

router.post(`${baseUrl}/msic-has-capital-bond-account-yn-router`, (req, res) => {
  const hasCapitalBondAccount = req.session.data['msic-has-capital-bond-account-yn']

  if (hasCapitalBondAccount === 'yes') {
    res.redirect(`${baseUrl}/msic-capital-bond-account`)
  } else {
    res.redirect(`${baseUrl}/msic-has-shares-account-yn`)
  }
})

router.post(`${baseUrl}/msic-has-shares-account-yn-router`, (req, res) => {
  const hasSharesAccount = req.session.data['msic-has-shares-account-yn']

  if (hasSharesAccount === 'yes') {
    res.redirect(`${baseUrl}/msic-shares-account`)
  } else {
    res.redirect(`${baseUrl}/msic-has-unit-trust-account-yn`)
  }
})

router.post(`${baseUrl}/msic-has-unit-trust-account-yn-router`, (req, res) => {
  const hasUnitTrustAccount = req.session.data['msic-has-unit-trust-account-yn']

  if (hasUnitTrustAccount === 'yes') {
    res.redirect(`${baseUrl}/msic-unit-trust-account`)
  } else {
    res.redirect(`${baseUrl}/msic-has-cash-at-home-yn`)
  }
})


router.post(`${baseUrl}/msic-has-cash-at-home-yn-router`, (req, res) => {
  const hasCashAtHome = req.session.data['msic-has-cash-at-home-yn']

  if (hasCashAtHome === 'yes') {
    res.redirect(`${baseUrl}/msic-cash-at-home`)
  } else {
    res.redirect(`${baseUrl}/msic-has-cash-other-abroad-yn`)
  }
})

router.post(`${baseUrl}/msic-cash-other-abroad-yn-router`, (req, res) => {
  const hasOtherCashAboad = req.session.data['msic-cash-other-abroad-yn']

  if (hasOtherCashAboad === 'yes') {
    res.redirect(`${baseUrl}/msic-cash-other-abroad`)
  } else {
    res.redirect(`${baseUrl}/msic-has-cash-lump-sum-yn`)
  }
})

router.post(`${baseUrl}/msic-has-cash-lump-sum-yn-router`, (req, res) => {
  const hasCashLumpSum = req.session.data['msic-has-cash-lump-sum-yn']

  if (hasCashLumpSum === 'yes') {
    res.redirect(`${baseUrl}/msic-cash-lump-sum`)
  } else {
    res.redirect(`${baseUrl}/msic-has-second-property-yn`)
  }
})

router.post(`${baseUrl}/msic-second-property-yn-router`, (req, res) => {
  const hasSecondProperty = req.session.data['msic-second-property-yn']

  if (hasSecondProperty === 'yes') {
    res.redirect(`${baseUrl}/msic-second-property`)
  } else {
    res.redirect(`${baseUrl}/msic-missing-account-yn`)
  }
})

router.post(`${baseUrl}/msic-all-money-accounts-summary-route`, (req, res) => {
  const hasSecondProperty = req.session.data['msic-has-missing-account-yn']

  if (hasSecondProperty === 'yes') {
    res.redirect(`${baseUrl}/msic-missing-account`)
  } else {
    res.redirect(`${baseUrl}/msic-all-money-accounts-summary`)
  }
})

router.post(`${baseUrl}/msic-has-payments-yn-router`, (req, res) => {
  const hasSecondProperty = req.session.data['msic-has-payments-yn']

  if (hasSecondProperty === 'yes') {
    res.redirect(`${baseUrl}/msic-missing-account-state-pension-check-yn`)
  } else {
    res.redirect(`${baseUrl}/msic-missing-account-benfit-check-yn`)
  }
})

router.post(`${baseUrl}/msic-missing-account-state-pension-check-yn-router`, (req, res) => {
  const hasSecondProperty = req.session.data['msic-missing-account-state-pension-check-yn']

  if (hasSecondProperty === 'yes') {
    res.redirect(`${baseUrl}/msic-missing-account-benfit-check-yn`)
  } else {
    res.redirect(`${baseUrl}/msic-missing-account-select`)
  }
})

router.post(`${baseUrl}/msic-missing-account-benfit-check-yn-router`, (req, res) => {
  const hasSecondProperty = req.session.data['msic-missing-account-benfit-check-yn']

  if (hasSecondProperty === 'yes') {
    res.redirect(`${baseUrl}/msic-pc-account`)
  } else {
    res.redirect(`${baseUrl}/msic-missing-account-select`)
  }
})

router.post(`${baseUrl}/msic-all-money-accounts-check-yn-router`, (req, res) => {
  const hasSecondProperty = req.session.data['msic-all-money-accounts-check-yn']

  if (hasSecondProperty === 'yes') {
    res.redirect(`${baseUrl}/task-list`)
  } else {
    res.redirect(`${baseUrl}/msic-missing-account-yn`)
  }
})

// MSIC END




module.exports = router
