const express = require('express')

const router = new express.Router()
const baseUrl = '/sprint-2/short-claim'

router.post(`${baseUrl}/about-you-router`, (req, res) => {
  const selfEmployed = req.session.data['self-employed']
  const rightToAbode = req.session.data['right-to-abode']

  if (rightToAbode === 'no') {
    res.redirect(`${baseUrl}/not-eligible`)
  } else if (selfEmployed === 'yes') {
    res.redirect(`${baseUrl}/notify-cas`)
  } else {
    res.redirect(`${baseUrl}/postcode-lookup`)
  }
})

router.post(`${baseUrl}/home-ownership-router`, (req, res) => {
  const ownhome = req.session.data['home-ownership']

  if (ownhome === 'Own') {
    res.redirect(`${baseUrl}/ground-rent`)
  } else {
    res.redirect(`${baseUrl}/has-partner`)
  }
})

router.post(`${baseUrl}/has-partner-router`, (req, res) => {
  const hasPartner = req.session.data['has-partner']

  if (hasPartner === 'yes') {
    res.redirect(`${baseUrl}/about-partner`)
  } else {
    res.redirect(`${baseUrl}/has-private-pensions`)
  }
})

router.post(`${baseUrl}/about-partner-router`, (req, res) => {
  const selfEmployed = req.session.data['partner-self-employed']

  if (selfEmployed === 'yes') {
    res.redirect(`${baseUrl}/notify-cas`)
  } else {
    res.redirect(`${baseUrl}/has-private-pensions`)
  }
})

router.post(`${baseUrl}/has-private-pensions-router`, (req, res) => {
  const hasPrivatePensions = req.session.data['has-private-pensions']

  if (hasPrivatePensions === 'yes') {
    res.redirect(`${baseUrl}/about-pension`)
  } else {
    res.redirect(`${baseUrl}/money-you-have`)
  }
})

router.post(`${baseUrl}/money-you-have-router`, (req, res) => {
  const over10k = req.session.data['over-10k']

  if (over10k === 'yes') {
    res.redirect(`${baseUrl}/capital`)
  } else {
    res.redirect(`${baseUrl}/second-property`)
  }
})

module.exports = router
