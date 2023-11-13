const express = require('express')
const { getStatePensionDate } = require('get-state-pension-date')
const differenceInDays = require('date-fns/differenceInDays')
const startOfDay = require('date-fns/startOfDay')
const subMonths = require('date-fns/subMonths')
const got = require('got')
const fs = require('fs')
const {getMonth} = require('../../filters')()

const router = new express.Router()
const baseUrl = '/agent-service-1-1/agent'

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

router.post(`${baseUrl}/system-ur-process-ab-router`, (req, res) => {
  const processAB = req.session.data['system-ur-process-ab']

  if (processAB === 'A') {
    res.redirect(`${baseUrl}/process-b-nil-task-list`)
  } else {
    res.redirect(`${baseUrl}/process-c-nil-task-list`)
  }
})




// router.post(`${baseUrl}/ur-search-router`, (req, res) => {
//   const niRouter = req.session.data['ur-search']
//
//   if (niRouter === 'P1') {
//     res.redirect(`${baseUrl}/ur-record`)
//   } else if (niRouter === 'P2') {
//     res.redirect(`${baseUrl}/ur-record`)
//
//   } else {
//     res.redirect(`${baseUrl}/fail`)
//   }
// })


module.exports = router
