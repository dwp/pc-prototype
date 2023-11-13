const express = require('express')
const { getStatePensionDate } = require('get-state-pension-date')
const differenceInDays = require('date-fns/differenceInDays')
const startOfDay = require('date-fns/startOfDay')
const subMonths = require('date-fns/subMonths')
const got = require('got')
const fs = require('fs')
const {getMonth} = require('../../filters')()

const router = new express.Router()
const baseUrl = '/version-15/survey'

function makeAStay(data) {
  const admission = new Date(`${data['admission-year']}-${data['admission-month']}-${data['admission-day']}`)
  const discharge = new Date(`${data['discharge-year']}-${data['discharge-month']}-${data['discharge-day']}`)
  const totalDays = Math.max(differenceInDays(discharge, admission) - 1, 0)
  return {admission, discharge, totalDays}
}

router.post(`${baseUrl}/survey-journey-router`, (req, res) => {
  const pensionScenarios = req.session.data['survey-journey']

  if (surveyJourney === 'A') {
    res.redirect(`${baseUrl}/a`)
  } else if (surveyJourney === 'B') {
      res.redirect(`${baseUrl}/b`)
  }
})




module.exports = router
