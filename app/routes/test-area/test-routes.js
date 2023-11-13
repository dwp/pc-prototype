const express = require('express')
const { getStatePensionDate } = require('get-state-pension-date')
const differenceInDays = require('date-fns/differenceInDays')
const startOfDay = require('date-fns/startOfDay')
const subMonths = require('date-fns/subMonths')
const got = require('got')
const fs = require('fs')
const {getMonth} = require('../../filters')()

const router = new express.Router()
const baseUrl = '/test-area/test-routes'

function makeAStay(data) {
  const admission = new Date(`${data['admission-year']}-${data['admission-month']}-${data['admission-day']}`)
  const discharge = new Date(`${data['discharge-year']}-${data['discharge-month']}-${data['discharge-day']}`)
  const totalDays = Math.max(differenceInDays(discharge, admission) - 1, 0)
  return {admission, discharge, totalDays}
}


  router.post('/name-router', (req, res, next) => {
    const xName = req.session.data['page&dataname']

    if (xName === 'Telephone') {
      res.redirect('telephone-national-insurance-check')
    } else if (xName === 'Paper') {
      res.redirect('paper-national-insurance-check')
    } else {
      res.redirect('xxx')
    }
  })

  router.post('/telephone-national-insurance-check-router', (req, res, next) => {
    const telephoneNIcheck = String(req.session.data['telephone-national-insurance-check']).toUpperCase()

    if (telephoneNIcheck === 'E1') {
      res.redirect('exclusion-1')
    } else if (telephoneNIcheck === 'E2') {
      res.redirect('exclusion-2')
    } else if (telephoneNIcheck === 'E3') {
      res.redirect('exclusion-3')
    } else if (telephoneNIcheck === 'E4') {
      res.redirect('exclusion-4')
    } else if (telephoneNIcheck === 'E5') {
      res.redirect('exclusion-5')
    } else if (telephoneNIcheck === 'E6') {
      res.redirect('exclusion-6')
    } else if (telephoneNIcheck === 'E7') {
      res.redirect('exclusion-7')
    } else if (telephoneNIcheck === 'E8') {
      res.redirect('exclusion-8')
    } else if (telephoneNIcheck === 'E9') {
      res.redirect('exclusion-9')
    } else if (telephoneNIcheck === 'E10') {
      res.redirect('exclusion-10')
    } else if (telephoneNIcheck === 'RRE') {
      res.redirect('telephone-rre')
    } else if (telephoneNIcheck === 'NOCOPE') {
      res.redirect('telephone-cope-check')
    } else if (telephoneNIcheck === 'NI') {
      res.redirect('telephone-cope-check')
    } else {
      res.redirect('validation')
    }
  })


  router.post('/telephone-forecast-enquiry-router', (req, res, next) => {
    const telephoneForecastEnquiry = req.session.data['telephone-forecast-enquiry']

    if (telephoneForecastEnquiry === 'Forecast') {
      res.redirect('online-prompt')
    } else if (telephoneForecastEnquiry === 'Enquiry') {
      res.redirect('telephone-statement-check')
    } else {
      res.redirect('xxx')
    }
  })


  router.post('/address-check-router', (req, res, next) => {
    const addressCheck = req.session.data['address-check']

    if (addressCheck === 'United Kingdom') {
      res.redirect('address-postcode')
    } else if (addressCheck === 'Overseas') {
      res.redirect('address-manual')
    } else {
      res.redirect('XXX')
    }
  })



module.exports = router
