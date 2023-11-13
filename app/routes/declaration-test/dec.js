const express = require('express')
const { getStatePensionDate } = require('get-state-pension-date')
const differenceInDays = require('date-fns/differenceInDays')
const startOfDay = require('date-fns/startOfDay')
const subMonths = require('date-fns/subMonths')

const router = new express.Router()
const baseUrl = '/sprint-4/mvp'

router.post(`${baseUrl}/who-is-caller-router`, (req, res) => {
  const claimingFor = req.session.data['claiming-for']

  if (claimingFor === 'Yourself') {
    res.redirect(`${baseUrl}/name-and-nino`)
  }
  else if (claimingFor === 'PC1') {
    res.redirect(`${baseUrl}/notepad-PC1`)
  } else {
    res.redirect(`${baseUrl}/has-help`)
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
    res.redirect(`${baseUrl}/notepad-partner`)
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
      const threeMonthsAgo = subMonths(today, 3);
      req.session.data['back-dating-date'] = maleSpaDate < threeMonthsAgo ? threeMonthsAgo : maleSpaDate;
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

router.post(`${baseUrl}/mortgage-router`, (req, res) => {
  const hasMortgage = req.session.data['has-mortgage']

  if (hasMortgage === 'Yes') {
    res.redirect(`${baseUrl}/mortgage-yes`)
  } else {
    res.redirect(`${baseUrl}/address-summary`)
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

router.post(`${baseUrl}/other-income-router`, (req, res) => {
  const otherIncome = req.session.data['other-income']

  if (otherIncome === 'yes') {
    res.redirect(`${baseUrl}/notepad-otherIncome`)
  } else {
    res.redirect(`${baseUrl}/money-summary`)
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

router.post(`${baseUrl}/type-of-account-router`, (req, res) => {
  const accountType = req.session.data['account-type']

  if (accountType === 'uk') {
    res.redirect(`${baseUrl}/uk-account`)
  } else {
    res.redirect(`${baseUrl}/international-account`)
  }
})

router.post(`${baseUrl}/mortgage-router`, (req, res) => {
  const hasMortgage = req.session.data['has-mortgage']

  if (hasMortgage === 'Yes') {
    res.redirect(`${baseUrl}/mortgage-yes`)
  } else {
    res.redirect(`${baseUrl}/owns-council-tax`)
  }
})

router.post(`${baseUrl}/money-you-have-router`, (req, res) => {
  const hasOver10k = req.session.data['over-10k']

  if (hasOver10k === 'yes') {
    res.redirect(`${baseUrl}/notepad-MoneyOver10k`)
  } else {
    res.redirect(`${baseUrl}/money-summary`)
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

  if (homeOwnership === 'Owned') {
    res.redirect(`${baseUrl}/service-charges`)
  }
  else if (homeOwnership === 'Rented') {
    res.redirect(`${baseUrl}/rent-housing-council-tax`)
  }
  else if (homeOwnership === 'Care Home') {
    res.redirect(`${baseUrl}/notepad-careHome`)
  }
  else if (homeOwnership === 'Sheltered Accommodation') {
    res.redirect(`${baseUrl}/notepad-sheltered`)
  }
  else if (homeOwnership === 'Someone Else') {
    res.redirect(`${baseUrl}/notepad-someoneElse`)
  }
  else if (homeOwnership === 'Other') {
    res.redirect(`${baseUrl}/notepad-otherRes`)
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
  const otherPensions = req.session.data['people-in-home']

  if (otherPensions === 'Yes') {
    res.redirect(`${baseUrl}/notepad-otherPensions`)
  } else {
    res.redirect(`${baseUrl}/notional-summary`)
  }
})

router.post(`${baseUrl}/hospital-yn-router`, (req, res) => {
  const hospital = req.session.data['hospital-yn']

  if (hospital === 'Yes') {
    res.redirect(`${baseUrl}/notepad-hospital-dates`)
  } else {
    res.redirect(`${baseUrl}/task-list`)
  }
})

module.exports = router
