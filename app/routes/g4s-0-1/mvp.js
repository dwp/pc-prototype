const express = require('express')
const { getStatePensionDate } = require('get-state-pension-date')
const differenceInDays = require('date-fns/differenceInDays')
const startOfDay = require('date-fns/startOfDay')
const subMonths = require('date-fns/subMonths')
const got = require('got')
const fs = require('fs')
const {getMonth} = require('../../filters')()

const router = new express.Router()
const baseUrl = '/g4s-0-1/mvp'

function makeAStay(data) {
  const admission = new Date(`${data['admission-year']}-${data['admission-month']}-${data['admission-day']}`)
  const discharge = new Date(`${data['discharge-year']}-${data['discharge-month']}-${data['discharge-day']}`)
  const totalDays = Math.max(differenceInDays(discharge, admission) - 1, 0)
  return {admission, discharge, totalDays}
}


router.post(`${baseUrl}/login-router`, (req, res) => {
  const loginCheck = req.session.data['user-full-name']

  if (loginCheck === 'Pete Bates') {
    res.redirect(`${baseUrl}/case-load`)
  }
  else if (loginCheck === 'Admin') {
    res.redirect(`${baseUrl}/admin-case-load`)
  }
   else {
    res.redirect(`${baseUrl}/XXX`)
  }
})

router.post(`${baseUrl}/process-resides-in-uk-router`, (req, res) => {
  const residesInUk = req.session.data['process-resides-in-uk']

  if (residesInUk === 'England') {
    res.redirect(`${baseUrl}/process-partner`)
  } else if (residesInUk === 'Scotland') {
    res.redirect(`${baseUrl}/process-partner`)
  } else if (residesInUk === 'Wales') {
    res.redirect(`${baseUrl}/process-partner`)
  } else if (residesInUk === 'Northern-Ireland') {
    res.redirect(`${baseUrl}/process-partner`)
  } else {
    res.redirect(`${baseUrl}/done-none-uk`)
  }
})

router.post(`${baseUrl}/process-evidence-prompt`, (req, res) => {
  const processOutcome = req.session.data['process-outcome']

  if (processOutcome === 'Yes') {
    res.redirect(`${baseUrl}/process-evidence-prompt`)
  } else {
    res.redirect(`${baseUrl}/done-none-uk`)
  }
})



router.post(`${baseUrl}/process-benefits-router`, (req, res) => {
  const processBenefits = req.session.data['process-benefits']

  if (processBenefits === 'Yes') {
    res.redirect(`${baseUrl}/process-outcome`)
  } else {
    res.redirect(`${baseUrl}/process-private-pensions-pension`)
  }
})

router.post(`${baseUrl}/process-outcome-router`, (req, res) => {
  const processOutcome = req.session.data['process-outcome']

  if (processOutcome === 'Yes') {
    res.redirect(`${baseUrl}/process-evidence-prompt`)
  } else {
    res.redirect(`${baseUrl}/Doesnt-want-to-apply`)
  }
})

router.post(`${baseUrl}/pensions-router`, (req, res) => {
  const pensions = req.session.data['pensions']

  if (pensions === 'Yes') {
    res.redirect(`${baseUrl}/outcome-unlikely`)
  } else {
    res.redirect(`${baseUrl}/earnings`)
  }
})

router.post(`${baseUrl}/earnings-router`, (req, res) => {
  const earnings = req.session.data['earnings']

  if (earnings === 'Yes') {
    res.redirect(`${baseUrl}/outcome-unlikely`)
  } else {
    res.redirect(`${baseUrl}/outcome-likely`)
  }
})




module.exports = router
