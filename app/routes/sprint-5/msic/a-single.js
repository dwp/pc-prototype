const express = require('express')
const { getStatePensionDate } = require('get-state-pension-date')
const differenceInDays = require('date-fns/differenceInDays')
const startOfDay = require('date-fns/startOfDay')

const router = new express.Router()
const baseUrl = '/sprint-5/msic/a-single'

router.post(`${baseUrl}/who-is-caller-router`, (req, res) => {
  const claimingFor = req.session.data['claiming-for']

  if (claimingFor === 'Myself') {
    res.redirect(`${baseUrl}/name-and-nino`)
  } else {
    res.redirect(`${baseUrl}/has-help`)
  }
})

router.post(`${baseUrl}/has-help-router`, (req, res) => {
  const hasHelp = req.session.data['has-help']

  if (hasHelp === 'Myself') {
    res.redirect(`${baseUrl}/over-spa`)
  } else {
    res.redirect(`${baseUrl}/has-help`)
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
      req.session.data['spa-date'] = maleSpaDate
      res.redirect(`${baseUrl}/reside-in-uk`)
    } else if (daysSinceMaleSPA < 0 && daysSinceFemaleSPA < 0) {
      res.redirect(`${baseUrl}/not-eligible`)
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
    const today = startOfDay(new Date())
    const spaDate = getStatePensionDate(dob, sex)
    const daysSinceSPA = differenceInDays(today, spaDate)

    if (daysSinceSPA >= 0) {
      req.session.data['spa-date'] = spaDate
      res.redirect(`${baseUrl}/reside-in-uk`)
    } else {
      res.redirect(`${baseUrl}/not-eligible`)
    }
  } catch (err) {
    res.redirect(`${baseUrl}/reside-in-uk`)
  }
})

router.post(`${baseUrl}/reside-in-uk-router`, (req, res) => {
  const residesInUk = req.session.data['resides-in-uk']

  if (residesInUk === 'Yes') {
    res.redirect(`${baseUrl}/lived-abroad`)
  } else {
    res.redirect(`${baseUrl}/not-eligible`)
  }
})

router.post(`${baseUrl}/lived-abroad-router`, (req, res) => {
  const livedAbroad = req.session.data['lived-abroad']

  if (livedAbroad === 'Yes') {
    res.redirect(`${baseUrl}/uk-national`)
  } else {
    res.redirect(`${baseUrl}/hrt`)
  }
})

router.post(`${baseUrl}/uk-national-router`, (req, res) => {
  const ukNational = req.session.data['uk-national']

  if (ukNational === 'Yes') {
    res.redirect(`${baseUrl}/claim-date`)
  } else {
    res.redirect(`${baseUrl}/hrt`)
  }
})

router.post(`${baseUrl}/claim-date`, (req, res, next) => {
  res.locals.now = new Date()

  next()
})

router.post(`${baseUrl}/security-router`, (req, res) => {
  const passedSecurity = req.session.data['passed-security']

  if (passedSecurity === 'Yes') {
    res.redirect(`${baseUrl}/eligibility-summary`)
  } else {
    res.redirect(`${baseUrl}/agent-action`)
  }
})

router.post(`${baseUrl}/can-contact-router`, (req, res) => {
  const contactOptions = req.session.data['contact-options']

  if (contactOptions.includes('Text') && contactOptions.includes('Phone call')) {
    res.redirect(`${baseUrl}/mobile-call`)
  } else if (contactOptions.includes('Text')) {
    res.redirect(`${baseUrl}/mobile`)
  } else if (contactOptions.includes('Phone call')) {
    res.redirect(`${baseUrl}/landline`)
  } else if (contactOptions.includes('Email')) {
    res.redirect(`${baseUrl}/email`)
  } else {
    res.redirect(`${baseUrl}/disability`)
  }
})

router.post(`${baseUrl}/mobile-call-router`, (req, res) => {
  const contactOptions = req.session.data['contact-options'] || []

  if (contactOptions.includes('Email')) {
    res.redirect(`${baseUrl}/email`)
  } else {
    res.redirect(`${baseUrl}/disability`)
  }
})

router.post(`${baseUrl}/home-ownership-router`, (req, res) => {
  const homeOwnership = req.session.data['home-ownership']

  if (homeOwnership === 'Owned') {
    res.redirect(`${baseUrl}/service-charges`)
  } else if (homeOwnership === 'Care home') {
    res.redirect(`${baseUrl}/is-care-home-permanent`)
  } else {
    res.redirect(`${baseUrl}/address-summary`)
  }
})

router.post(`${baseUrl}/mortgage-router`, (req, res) => {
  const hasMortgage = req.session.data['has-mortgage']

  if (hasMortgage === 'Yes') {
    res.redirect(`${baseUrl}/mortgage-yes`)
  } else {
    res.redirect(`${baseUrl}/address-summary`)
  }
})

router.post(`${baseUrl}/has-partner-router`, (req, res) => {
  const hasPartner = req.session.data['has-partner']
  const homeOwnership = req.session.data['home-ownership']

  if (hasPartner === 'Yes') {
    res.redirect(`${baseUrl}/about-partner`)
  } else if (homeOwnership === 'Owns') {
    res.redirect(`${baseUrl}/anyone-living-with-you`)
  } else {
    res.redirect(`${baseUrl}/anyone-living-with-you`)
  }
})

router.post(`${baseUrl}/about-partner-router`, (req, res) => {
  const homeOwnership = req.session.data['home-ownership']

  if (homeOwnership === 'Owns') {
    res.redirect(`${baseUrl}/anyone-living-with-you`)
  } else {
    res.redirect(`${baseUrl}/household-summary`)
  }
})

router.post(`${baseUrl}/anyone-living-with-you-router`, (req, res) => {
  const peopleInHome = req.session.data['people-in-home']

  if (peopleInHome === 'Yes') {
    res.redirect(`${baseUrl}/other-people-who-live-with-you`)
  } else {
    res.redirect(`${baseUrl}/household-summary`)
  }
})

router.post(`${baseUrl}/other-people-who-live-with-you-router`, (req, res) => {
  const personType = req.session.data['person-type']

  if (personType === 'Child under 16') {
    res.redirect(`${baseUrl}/about-child`)
  } else if (personType === 'Qualifying young person') {
    res.redirect(`${baseUrl}/about-qyp`)
  } else {
    res.redirect(`${baseUrl}/boarders-and-lodgers`)
  }
})

router.post(`${baseUrl}/about-child-router`, (req, res) => {
  const childBenefits = req.session.data['child-benefits'] || []

  if (childBenefits.includes('Personal Independance Payment (PIP)')) {
    res.redirect(`${baseUrl}/child-pip`)
  } else if (childBenefits.includes('Disibility Living Allowance (DLA)')) {
    res.redirect(`${baseUrl}/child-dla`)
  } else {
    res.redirect(`${baseUrl}/household-summary`)
  }
})

router.post(`${baseUrl}/child-pip-router`, (req, res) => {
  const childBenefits = req.session.data['child-benefits'] || []

  if (childBenefits.includes('Disibility Living Allowance (DLA)')) {
    res.redirect(`${baseUrl}/child-dla`)
  } else {
    res.redirect(`${baseUrl}/household-summary`)
  }
})

router.post(`${baseUrl}/about-qyp-router`, (req, res) => {
  const childBenefits = req.session.data['qyp-benefits'] || []

  if (childBenefits.includes('Personal Independance Payment (PIP)')) {
    res.redirect(`${baseUrl}/qyp-pip`)
  } else if (childBenefits.includes('Disibility Living Allowance (DLA)')) {
    res.redirect(`${baseUrl}/qyp-dla`)
  } else {
    res.redirect(`${baseUrl}/household-summary`)
  }
})

router.post(`${baseUrl}/qyp-pip-router`, (req, res) => {
  const childBenefits = req.session.data['qyp-benefits'] || []

  if (childBenefits.includes('Disibility Living Allowance (DLA)')) {
    res.redirect(`${baseUrl}/qyp-dla`)
  } else {
    res.redirect(`${baseUrl}/household-summary`)
  }
})

// Money Savining and investement Routers

router.post(`${baseUrl}/money-you-have-router`, (req, res) => {
  const hasOver10k = req.session.data['over-10k']

  if (hasOver10k === 'yes') {
    res.redirect(`${baseUrl}/msic-has-bank-current-account-yn`)
  } else {
    res.redirect(`${baseUrl}/msic-all-money-accounts-summary`)
  }
})

router.post(`${baseUrl}/msic-has-bank-current-account-yn-router`, (req, res) => {
  const hasCurrentAccount = req.session.data['msic-has-bank-current-account-yn']

  if (hasCurrentAccount === 'yes') {
    res.redirect(`${baseUrl}/msic-bank-current-account`)
  } else {
    res.redirect(`${baseUrl}/msic-has-buildings-current-account-yn`)
  }
})

router.post(`${baseUrl}/msic-has-buildings-current-account-yn-router`, (req, res) => {
  const hasBuildingsCurrentAccount = req.session.data['msic-has-buildings-current-account-yn']

  if (hasBuildingsCurrentAccount === 'yes') {
    res.redirect(`${baseUrl}/msic-building-current-account`)
  } else {
    res.redirect(`${baseUrl}/msic-has-post-office-card-account-yn`)
  }
})

router.post(`${baseUrl}/msic-has-post-office-card-account-yn-router`, (req, res) => {
  const hasPostOfficeCardAccount = req.session.data['msic-has-post-office-card-account-yn']

  if (hasPostOfficeCardAccount === 'yes') {
    res.redirect(`${baseUrl}/msic-post-office-card-account`)
  } else {
    res.redirect(`${baseUrl}/msic-has-bank-savings-account-yn`)
  }
})


router.post(`${baseUrl}/msic-has-bank-savings-account-yn-router`, (req, res) => {
  const hasBankSavingsAccount = req.session.data['msic-has-bank-savings-account-yn']

  if (hasBankSavingsAccount === 'yes') {
    res.redirect(`${baseUrl}/msic-bank-savings-account`)
  } else {
    res.redirect(`${baseUrl}/msic-has-buildings-savings-account-yn`)
  }
})

router.post(`${baseUrl}/msic-has-buildings-savings-account-yn-router`, (req, res) => {
  const hasBuildingsSavingsAccount = req.session.data['msic-has-buildings-current-account-yn']

  if (hasBuildingsSavingsAccount === 'yes') {
    res.redirect(`${baseUrl}/msic-buildings-savings-account`)
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
  const hasBuildingsSavingsAccount = req.session.data['msic-has-shares-account-yn']

  if (hasBuildingsSavingsAccount === 'yes') {
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
  const hasCashAtHome = req.session.data['msic-cash-other-abroad-yn']

  if (hasCashAtHome === 'yes') {
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
    res.redirect(`${baseUrl}/msic-all-money-accounts-pre-summary`)
  }
})

// XXXXX


router.post(`${baseUrl}/employment-router`, (req, res) => {
  const employmentFulltime = req.session.data['employment-fulltime']

  if (employmentFulltime === 'yes') {
    res.redirect(`${baseUrl}/still-employed`)
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

router.post(`${baseUrl}/type-of-account-router`, (req, res) => {
  const accountType = req.session.data['account-type']

  if (accountType === 'uk') {
    res.redirect(`${baseUrl}/uk-account`)
  } else {
    res.redirect(`${baseUrl}/international-account`)
  }
})

router.post(`${baseUrl}/is-care-home-permanent-router`, (req, res) => {
  const careHomePermanence = req.session.data['care-home-permanence']

  if (careHomePermanence === 'Yes') {
    res.redirect(`${baseUrl}/permanent-care-home-date`)
  } else {
    res.redirect(`${baseUrl}/care-home-date`)
  }
})

router.post(`${baseUrl}/privacy-policy-router`, (req, res) => { // router name
  const privacyPolicy = req.session.data['agrees-privacy']  // name of data / id name

  if (privacyPolicy === 'Agree') { // name of data / + answer
    res.redirect(`${baseUrl}/pre-declaration`)
  } else {
    res.redirect(`${baseUrl}/out-declaration`)
  }
})


router.post(`${baseUrl}/pre-declaration-router`, (req, res) => {
  const preDeclaration = req.session.data['pre-declaration']

  if (preDeclaration === 'Agree') {
    res.redirect(`${baseUrl}/who-is-caller`)
  } else {
    res.redirect(`${baseUrl}/out-declaration`)
  }
})




module.exports = router
