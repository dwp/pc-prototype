const express = require('express')
const { getStatePensionDate } = require('get-state-pension-date')

const router = new express.Router()
const baseUrl = '/sprint-3/new-claims'

router.post(`${baseUrl}/who-is-caller-router`, (req, res) => {
  const claimingFor = req.session.data['claiming-for']

  if (claimingFor === 'Myself') {
    res.redirect(`${baseUrl}/over-spa`)
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
    const sex = req.session.data['sex']
    const dob = req.session.data['dob-year'] + '-' +
      req.session.data['dob-month'].padStart(2, '0') + '-' +
      req.session.data['dob-day'].padStart(2, '0')

    const spaDate = getStatePensionDate(dob, sex)

    if (new Date(spaDate) <= new Date()) {
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
    res.redirect(`${baseUrl}/hrt`)
  } else {
    res.redirect(`${baseUrl}/uk-national`)
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

router.post(`${baseUrl}/money-you-have-router`, (req, res) => {
  const hasOver10k = req.session.data['over-10k']

  if (hasOver10k === 'yes') {
    res.redirect(`${baseUrl}/has-current-account`)
  } else {
    res.redirect(`${baseUrl}/money-summary`)
  }
})

router.post(`${baseUrl}/has-current-account-router`, (req, res) => {
  const hasCurrentAccount = req.session.data['has-current-account']

  if (hasCurrentAccount === 'yes') {
    res.redirect(`${baseUrl}/current-account`)
  } else {
    res.redirect(`${baseUrl}/has-cash`)
  }
})

router.post(`${baseUrl}/has-savings-account-router`, (req, res) => {
  const hasSavingsAccount = req.session.data['has-savings-account']

  if (hasSavingsAccount === 'yes') {
    res.redirect(`${baseUrl}/savings-account`)
  } else {
    res.redirect(`${baseUrl}/has-cash`)
  }
})

router.post(`${baseUrl}/has-shares-router`, (req, res) => {
  const hasShares = req.session.data['has-shares']

  if (hasShares === 'yes') {
    res.redirect(`${baseUrl}/shares`)
  } else {
    res.redirect(`${baseUrl}/has-unit-trust`)
  }
})

router.post(`${baseUrl}/has-unit-trust-router`, (req, res) => {
  const hasUnitTrust = req.session.data['has-unit-trust']

  if (hasUnitTrust === 'yes') {
    res.redirect(`${baseUrl}/unittrust-account`)
  } else {
    res.redirect(`${baseUrl}/has-bonds`)
  }
})

router.post(`${baseUrl}/has-bonds-router`, (req, res) => {
  const hasSecondProperty = req.session.data['has-bonds-router']

  if (hasSecondProperty === 'yes') {
    res.redirect(`${baseUrl}/bond-account`)
  } else {
    res.redirect(`${baseUrl}/has-second-property`)
  }
})

router.post(`${baseUrl}/has-second-property-router`, (req, res) => {
  const hasSecondProperty = req.session.data['has-second-property']

  if (hasSecondProperty === 'yes') {
    res.redirect(`${baseUrl}/second-property`)
  } else {
    res.redirect(`${baseUrl}/money-summary`)
  }
})

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
  }
  if (employmentType === 'Full time employment') {
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

module.exports = router
