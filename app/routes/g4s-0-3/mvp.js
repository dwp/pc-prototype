const express = require('express')
const { getStatePensionDate } = require('get-state-pension-date')
const differenceInDays = require('date-fns/differenceInDays')
const startOfDay = require('date-fns/startOfDay')
const subMonths = require('date-fns/subMonths')
const got = require('got')
const fs = require('fs')
const {getMonth} = require('../../filters')()

const router = new express.Router()
const baseUrl = '/g4s-0-3/mvp'

function makeAStay(data) {
  const admission = new Date(`${data['admission-year']}-${data['admission-month']}-${data['admission-day']}`)
  const discharge = new Date(`${data['discharge-year']}-${data['discharge-month']}-${data['discharge-day']}`)
  const totalDays = Math.max(differenceInDays(discharge, admission) - 1, 0)
  return {admission, discharge, totalDays}
}

router.post(`${baseUrl}/reside-in-uk-router`, (req, res) => {
  const residesInUk = req.session.data['resides-in-uk']

  if (residesInUk === 'England') {
    res.redirect(`${baseUrl}/claimant-dob`)
  } else if (residesInUk === 'Scotland') {
    res.redirect(`${baseUrl}/claimant-dob`)
  } else if (residesInUk === 'Wales') {
    res.redirect(`${baseUrl}/claimant-dob`)
  } else if (residesInUk === 'Northern-Ireland') {
    res.redirect(`${baseUrl}/claimant-dob`)
  } else {
    res.redirect(`${baseUrl}/done-none-uk`)
  }
})

router.post(`${baseUrl}/claimant-dob-router`, (req, res) => {
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
    res.redirect(`${baseUrl}/children-check-yn`)
  }
})

// router.post(`${baseUrl}/state-pension-check-yn-router`, (req, res) => {
//   const statePensionCheck = req.session.data['state-pension-check-yn']
//
//   if (statePensionCheck === 'Yes') {
//     res.redirect(`${baseUrl}/children-check-yn`)
//   } else {
//     res.redirect(`${baseUrl}/done-not-getting-sp`)
//   }
// })

router.post(`${baseUrl}/children-check-yn-router`, (req, res) => {
  const childrenCheck = req.session.data['children-check-yn']

  if (childrenCheck === 'No') {
    res.redirect(`${baseUrl}/claimant-national-insurance`)
  } else {
    res.redirect(`${baseUrl}/done-children`)
  }
})

router.post(`${baseUrl}/housing-costs-router`, (req, res) => {
  const housingCosts = req.session.data['housing-costs']

  if (housingCosts === 'Yes') {
    res.redirect(`${baseUrl}/outcome`)
  } else {
    res.redirect(`${baseUrl}/state-pension-amount`)
  }
})

router.post(`${baseUrl}/benefit-check-router`, (req, res) => {
  const benefitCheck = req.session.data['benefit-check']

  if (benefitCheck == 'SP') {
    res.redirect(`${baseUrl}/outcome`)
  } else {
    res.redirect(`${baseUrl}/pensions`)
  }
})

router.post(`${baseUrl}/pensions-router`, (req, res) => {
  const pensions = req.session.data['pensions']

  if (pensions === 'Yes') {
    res.redirect(`${baseUrl}/outcome`)
  } else {
    res.redirect(`${baseUrl}/earnings`)
  }
})

router.post(`${baseUrl}/earnings-router`, (req, res) => {
  const earnings = req.session.data['earnings']

  if (earnings === 'Yes') {
    res.redirect(`${baseUrl}/outcome`)
  } else {
    res.redirect(`${baseUrl}/outcome`)
  }
})


router.post(`${baseUrl}/outcome-yn-router`, (req, res) => {
  const outcomeYN = req.session.data['outcome-yn']

  if (outcomeYN === 'Yes') {
    res.redirect(`${baseUrl}/more-help`)
  } else {
    res.redirect(`${baseUrl}/exit`)
  }
})

router.post(`${baseUrl}/outcome-housing-costs-router`, (req, res) => {
  const outcomeHousingCosts = req.session.data['outcome-yn']

  if (outcomeHousingCosts === 'Yes') {
    res.redirect(`${baseUrl}/handover`)
  } else {
    res.redirect(`${baseUrl}/more-help`)
  }
})




router.post(`${baseUrl}/sl-find-a-claim-router`, (req, res) => {
  const slFindAClaim = req.session.data['sl-find-a-claim']

  if (slFindAClaim === 'S1 11 22 33 A') {
    res.redirect(`${baseUrl}/sl-claim-a`)
  } else if (slFindAClaim === 'S2 11 22 33 B') {
    res.redirect(`${baseUrl}/sl-claim-b`)
  } else if (slFindAClaim === 'S3 11 22 33 C') {
    res.redirect(`${baseUrl}/sl-claim-c`)
  } else if (slFindAClaim === 'S4 11 22 33 D') {
    res.redirect(`${baseUrl}/sl-claim-d`)
  } else if (slFindAClaim === 'S5 11 22 33 E') {
    res.redirect(`${baseUrl}/sl-claim-e`)
  } else if (slFindAClaim === 'S6 11 22 33 F') {
    res.redirect(`${baseUrl}/sl-claim-f`)
  } else {
    res.redirect(`${baseUrl}/XXX`)
  }
})

router.post(`${baseUrl}/outcome-radios-router`, (req, res) => {
  const outcomeRadios = req.session.data['outcome-radios']

  if (outcomeRadios === 'housing') {
    res.redirect(`${baseUrl}/housing`)
  } else if (outcomeRadios === 'help') {
    res.redirect(`${baseUrl}/more-help`)
  } else if (outcomeRadios === 'exit') {
    res.redirect(`${baseUrl}/exit`)
  } else if (outcomeRadios === 'dwp') {
    res.redirect(`${baseUrl}/handover-user-request`)
  } else if (outcomeRadios === 'manual-dwp') {
    res.redirect(`${baseUrl}/handover-user-request`)
  } else if (outcomeRadios === 'end') {
    res.redirect(`${baseUrl}/end`)
  } else {
    res.redirect(`${baseUrl}/XXX`)
  }
})







module.exports = router
