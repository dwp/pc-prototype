const express = require('express')
const { getStatePensionDate } = require('get-state-pension-date')
const differenceInDays = require('date-fns/differenceInDays')
const startOfDay = require('date-fns/startOfDay')
const subMonths = require('date-fns/subMonths')
const got = require('got')
const fs = require('fs')
const {getMonth} = require('../../filters')()

const router = new express.Router()
const baseUrl = '/searchlight/sl-1'

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

router.post(`${baseUrl}/claimant-national-insurance-router`, (req, res) => {
  const claimantNationalInsurance = req.session.data['claimant-national-insurance']

  if (claimantNationalInsurance === 'Yes') {
    res.redirect(`${baseUrl}/housing-service-charge`)
  } else if (claimantNationalInsurance === 'Lost') {
    res.redirect(`${baseUrl}/search-ni`)
  } else {
    res.redirect(`${baseUrl}/handover-early-ni`)
  }
})

router.post(`${baseUrl}/housing-costs-router`, (req, res) => {
  const housingCosts = req.session.data['housing-costs']

  if (housingCosts === 'Yes') {
    res.redirect(`${baseUrl}/outcome`)
  } else {
    res.redirect(`${baseUrl}/data-we-use`)
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



// AB ROUTER

router.post(`${baseUrl}/ab-check-pension-router`, (req, res) => {
  const abRouter = req.session.data['sl-find-a-claim']

  if (abRouter === 'SS 22 00 00 B') {
    res.redirect(`${baseUrl}/earnings`)
  } else if (abRouter === 'SS220000B') {
    res.redirect(`${baseUrl}/earnings`)

  } else if (abRouter === 'SS 33 00 00 C') {
    res.redirect(`${baseUrl}/outcome`)
  } else if (abRouter === 'SS330000C') {
    res.redirect(`${baseUrl}/outcome`)


  } else {
    res.redirect(`${baseUrl}/no-ni-selected`)
  }
})


// AB ROUTER END

router.post(`${baseUrl}/sl-find-a-claim-router`, (req, res) => {
  const slFindAClaim = req.session.data['sl-find-a-claim']

  if (slFindAClaim === 'SS 11 00 00 A') {
    res.redirect(`${baseUrl}/sl-claim-a`)
  } else if (slFindAClaim === 'SS110000A') {
    res.redirect(`${baseUrl}/sl-claim-a`)
  } else if (slFindAClaim === 'SS 22 00 00 B') {
    res.redirect(`${baseUrl}/sl-claim-b`)
  } else if (slFindAClaim === 'SS220000B') {
    res.redirect(`${baseUrl}/sl-claim-b`)
  } else if (slFindAClaim === 'SS 33 00 00 C') {
    res.redirect(`${baseUrl}/sl-claim-c`)
  } else if (slFindAClaim === 'SS330000C') {
    res.redirect(`${baseUrl}/sl-claim-c`)
  } else if (slFindAClaim === 'SS 44 00 00 D') {
    res.redirect(`${baseUrl}/sl-claim-d`)
  } else if (slFindAClaim === 'SS440000D') {
    res.redirect(`${baseUrl}/sl-claim-d`)
  } else if (slFindAClaim === 'SS 55 00 00 E') {
    res.redirect(`${baseUrl}/sl-claim-e`)
  } else if (slFindAClaim === 'SS550000E') {
    res.redirect(`${baseUrl}/sl-claim-e`)
  } else if (slFindAClaim === 'SS 66 00 00 F') {
    res.redirect(`${baseUrl}/sl-claim-f`)
  } else if (slFindAClaim === 'SS660000F') {
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
  } else if (outcomeRadios === 'challenge') {
    res.redirect(`${baseUrl}/challenge`)
  } else if (outcomeRadios === 'apply') {
    res.redirect(`${baseUrl}/handover`)
  } else {
    res.redirect(`${baseUrl}/XXX`)
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
  const outcomeRadios = req.session.data['outcome-radios']

  if (outcomeRadios === 'help') {
    res.redirect(`${baseUrl}/more-help`)
  } else if (outcomeRadios === 'dwp') {
    res.redirect(`${baseUrl}/handover-early`)

  } else {
    res.redirect(`${baseUrl}/exit`)
  }
})




module.exports = router
