const express = require('express')

const router = new express.Router()
const baseUrl = '/sprint-2/new-claims'

router.post(`${baseUrl}/has-partner-router`, (req, res) => {
  const hasPartner = req.session.data['has-partner']

  if (hasPartner === 'yes') {
    res.redirect(`${baseUrl}/partner-right-to-abode`)
  } else {
    res.redirect(`${baseUrl}/benefits`)
  }
})

router.post(`${baseUrl}/care-home-router`, (req, res) => {
  const inCareHome = req.session.data['care-home']

  if (inCareHome === 'yes') {
    res.redirect(`${baseUrl}/from-hospital`)
  } else {
    res.redirect(`${baseUrl}/postcode-lookup`)
  }
})

router.post(`${baseUrl}/care-home-permanence-router`, (req, res) => {
  const permanence = req.session.data['care-home-permanence']

  if (permanence === 'yes') {
    res.redirect(`${baseUrl}/care-home-funding`)
  } else {
    res.redirect(`${baseUrl}/postcode-lookup`)
  }
})

router.post(`${baseUrl}/address-choice-router`, (req, res) => {
  const inCareHome = req.session.data['care-home']

  if (inCareHome === 'no') {
    res.redirect(`${baseUrl}/home-ownership`)
  } else {
    res.redirect(`${baseUrl}/money-you-have`)
  }
})

router.post(`${baseUrl}/home-ownership-router`, (req, res) => {
  const homeOwnership = req.session.data['home-ownership']

  if (homeOwnership === 'own') {
    res.redirect(`${baseUrl}/ground-rent`)
  } else if (homeOwnership === 'rent') {
    res.redirect(`${baseUrl}/shared-tenancy`)
  } else if (homeOwnership === 'neither') {
    res.redirect(`${baseUrl}/other-people-you-live-with`)
  }
})

router.post(`${baseUrl}/money-you-have-router`, (req, res) => {
  const hasMoney = req.session.data['has-money']

  if (hasMoney === 'yes') {
    res.redirect(`${baseUrl}/cash`)
  } else {
    res.redirect(`${baseUrl}/has-private-pension`)
  }
})

router.post(`${baseUrl}/has-private-pension-router`, (req, res) => {
  const hasPensions = req.session.data['has-private-pensions']

  if (hasPensions === 'yes') {
    res.redirect(`${baseUrl}/about-your-pensions`)
  } else {
    res.redirect(`${baseUrl}/has-work`)
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
    res.redirect(`${baseUrl}/about-your-other-income`)
  } else {
    res.redirect(`${baseUrl}/type-of-account`)
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

router.post(`${baseUrl}/savings-router`, (req, res) => {
  const hasSavings = req.session.data['has-savings']

  if (hasSavings === 'yes') {
    const accountNumber = (req.session.data['number-of-accounts'] || 0)

    res.redirect(`/new-claims/savings-account/${accountNumber}`)
  } else {
    res.redirect(`${baseUrl}/has-shares`)
  }
})

router.get(`${baseUrl}/savings-account/:number`, (req, res, next) => {
  const { number } = req.params
  res.render('new-claims/savings-account.html', {
    accountNumber: number
  })
})

router.post(`${baseUrl}/savings-account-router`, (req, res) => {
  req.session.data['number-of-accounts'] = Object.keys(req.session.data).filter(key => key.match(/^account-\d+$/)).length
  res.redirect(`${baseUrl}/savings-summary`)
})

router.post(`${baseUrl}/has-shares-router`, (req, res) => {
  const hasShares = req.session.data['has-shares']

  if (hasShares === 'yes') {
    const shareNumber = (req.session.data['number-of-shares'] || 0)
    res.redirect(`/new-claims/shares/${shareNumber}`)
  } else {
    res.redirect(`${baseUrl}/property`)
  }
})

router.get(`${baseUrl}/shares/:number`, (req, res) => {
  const { number } = req.params
  res.render('new-claims/shares.html', {
    shareNumber: number
  })
})

router.post(`${baseUrl}/shares-router`, (req, res) => {
  req.session.data['number-of-shares'] = Object.keys(req.session.data).filter(key => key.match(/^share-company-\d+$/)).length
  res.redirect(`${baseUrl}/shares-summary`)
})

router.get(`${baseUrl}/other-people-you-live-with-router`, (req, res) => {
  const peopleInHome = req.session.data['people-in-home']

  if (peopleInHome === 'yes') {
    res.redirect(`${baseUrl}/relationship-to-claimant`)
  } else {
    res.redirect(`${baseUrl}/money-you-have`)
  }
})

router.post(`${baseUrl}/property-router`, (req, res) => {
  const hasProperty = req.session.data['has-property']

  if (hasProperty === 'yes') {
    res.redirect(`${baseUrl}/has-private-pension`)
  } else {
    res.redirect(`${baseUrl}/has-private-pension`)
  }
})

module.exports = router
