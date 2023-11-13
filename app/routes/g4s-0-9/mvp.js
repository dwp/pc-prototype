const express = require('express')
const { getStatePensionDate } = require('get-state-pension-date')
const differenceInDays = require('date-fns/differenceInDays')
const startOfDay = require('date-fns/startOfDay')
const subMonths = require('date-fns/subMonths')
const got = require('got')
const fs = require('fs')
const {getMonth} = require('../../filters')()

const router = new express.Router()
const baseUrl = '/g4s-0-9/mvp'

function makeAStay(data) {
  const admission = new Date(`${data['admission-year']}-${data['admission-month']}-${data['admission-day']}`)
  const discharge = new Date(`${data['discharge-year']}-${data['discharge-month']}-${data['discharge-day']}`)
  const totalDays = Math.max(differenceInDays(discharge, admission) - 1, 0)
  return {admission, discharge, totalDays}
}


router.post(`${baseUrl}/system-partner-check-router`, (req, res) => {
  const singleJoint = req.session.data['system-partner-check']

  if (singleJoint === 'Single') {
    res.redirect(`${baseUrl}/cya`)
  } else {
    res.redirect(`${baseUrl}/partner-state-pension-amount`)
  }
})




router.post(`${baseUrl}/system-where-you-like-ab-router`, (req, res) => {
  const g4sWhereYouLikeAB = req.session.data['system-where-you-like-ab']

  if (g4sWhereYouLikeAB === 'A') {
    res.redirect(`${baseUrl}/housing-type`)
  } else {
    res.redirect(`${baseUrl}/housing-type-b`)
  }
})

router.post(`${baseUrl}/housing-type-b-router`, (req, res) => {
  const g4sWhereYouLikeB = req.session.data['housing-type-b']

  if (g4sWhereYouLikeB === 'Yes') {
    res.redirect(`${baseUrl}/housing-ground-rent`)

  } else if (g4sWhereYouLikeB === 'No') {
    res.redirect(`${baseUrl}/housing-type-b-type`)
  } else {
    res.redirect(`${baseUrl}/housing-ground-rent`)
  }
})


  router.post(`${baseUrl}/housing-type-b-type-router`, (req, res) => {
    const housingTypeBType = req.session.data['housing-type-b-type']

    if (housingTypeBType === 'You own it') { // Looking for this checked data
      res.redirect(`${baseUrl}/housing-service-charge`) // If it finds it it does here
    }
    else if (housingTypeBType === 'Live in someone elses home') {
      res.redirect(`${baseUrl}/data-we-use`)
    }
    else if (housingTypeBType === 'Other accommodation') {
      res.redirect(`${baseUrl}/housing-service-charge`)
    }
    else {
      res.redirect(`${baseUrl}/housing-service-charge`) // If nothing is selected it will go here.
    }
  })




router.post(`${baseUrl}/g4s-partner-check-router`, (req, res) => {
  const g4sPartnerCheck = req.session.data['g4s-partner-check']

  if (g4sPartnerCheck === 'Single') {
    res.redirect(`${baseUrl}/start`)
  } else {
    res.redirect(`${baseUrl}/done-g4s-partner`)
  }
})

router.post(`${baseUrl}/reside-in-uk-router`, (req, res) => {
  const residesInUk = req.session.data['resides-in-uk']

  if (residesInUk === 'England') {
    res.redirect(`${baseUrl}/partner-check-yn`)
  } else if (residesInUk === 'Scotland') {
    res.redirect(`${baseUrl}/cpartner-check-yn`)
  } else if (residesInUk === 'Wales') {
    res.redirect(`${baseUrl}/partner-check-yn`)
  } else if (residesInUk === 'Northern-Ireland') {
    res.redirect(`${baseUrl}/done-ni`)
  } else {
    res.redirect(`${baseUrl}/done-none-uk`)
  }
})

// router.post(`${baseUrl}/claimant-dob-router`, (req, res) => {
//   try {
//     const dob = req.session.data['dob-year'] + '-' +
//       req.session.data['dob-month'].padStart(2, '0') + '-' +
//       req.session.data['dob-day'].padStart(2, '0')
//
//     const today = startOfDay(new Date())
//     const maleSpaDate = getStatePensionDate(dob, 'M')
//     const femaleSpaDate = getStatePensionDate(dob, 'F')
//     const daysSinceMaleSPA = differenceInDays(today, maleSpaDate)
//     const daysSinceFemaleSPA = differenceInDays(today, femaleSpaDate)
//
//     if (daysSinceMaleSPA >= 0 && daysSinceFemaleSPA >= 0) {
//       const threeMonthsAgo = subMonths(today, 3)
//       req.session.data['back-dating-date'] = maleSpaDate < threeMonthsAgo ? threeMonthsAgo : maleSpaDate
//       req.session.data['spa-date'] = maleSpaDate
//
//       res.redirect(`${baseUrl}/reside-in-uk`)
//     } else if (daysSinceMaleSPA < 0 && daysSinceFemaleSPA < 0) {
//       res.redirect(`${baseUrl}/reside-in-uk`)
//     } else {
//       res.redirect(`${baseUrl}/sex`)
//     }
//   } catch (err) {
//     res.redirect(`${baseUrl}/children-check-yn`)
//   }
// })



router.post(`${baseUrl}/claimant-dob-router`, (req, res) => {
  const claimantDOB = req.session.data['partner-check-yn']

  if (claimantDOB === 'Yes, we live together') {
    res.redirect(`${baseUrl}/partner-dob`)
  } else {
    res.redirect(`${baseUrl}/children-check-yn`)
  }
})

router.post(`${baseUrl}/system-children-mac-check-router`, (req, res) => {
  const systemChildrenMacCheck = req.session.data['system-children-mac-check']

  if (systemChildrenMacCheck === 'single-claim') {
    res.redirect(`${baseUrl}/housing-type`)
  } else if (systemChildrenMacCheck === 'too-young') {
    res.redirect(`${baseUrl}/done-too-young`)
  } else if (systemChildrenMacCheck === 'children-mac') {
    res.redirect(`${baseUrl}/cya`)
  } else {
    res.redirect(`${baseUrl}/cya`)
  }
})



router.post(`${baseUrl}/claimant-national-insurance-router`, (req, res) => {
  const claimantNationalInsurance = req.session.data['claimant-national-insurance']

  if (claimantNationalInsurance === 'Yes') {
    res.redirect(`${baseUrl}/housing-service-charge`)
  } else if (claimantNationalInsurance === 'Lost') {
    res.redirect(`${baseUrl}/claimant-search-ni`)
  } else {
    res.redirect(`${baseUrl}/handover-early-ni`)
  }
})

router.post(`${baseUrl}/housing-type-router`, (req, res) => {
  const housingType = req.session.data['housing-type']

  if (housingType === 'You own it') { // Looking for this checked data
    res.redirect(`${baseUrl}/housing-service-charge`) // If it finds it it does here
  }
  else if (housingType === 'You rent it') {
    res.redirect(`${baseUrl}/housing-ground-rent`)
  }
  else if (housingType === 'Shared ownership') {
    res.redirect(`${baseUrl}/housing-ground-rent`)
  }
  else if (housingType === 'You live in a caravan houseboat or mobile home') {
    res.redirect(`${baseUrl}/housing-service-charge`)
  }
  else if (housingType === 'Live in someone elses home') {
    res.redirect(`${baseUrl}/data-we-use`)
  }
  else if (housingType === 'Other accommodation') {
    res.redirect(`${baseUrl}/housing-service-charge`)
  }
  else {
    res.redirect(`${baseUrl}/blank`) // If nothing is selected it will go here.
  }
})



router.post(`${baseUrl}/partner-national-insurance-router`, (req, res) => {
  const partnerNationalInsurance = req.session.data['partner-national-insurance']

  if (partnerNationalInsurance === 'Yes') {
    res.redirect(`${baseUrl}/partner-state-pension-amount`)
  } else if (partnerNationalInsurance === 'Lost') {
    res.redirect(`${baseUrl}/partner-search-ni`)
  } else {
    res.redirect(`${baseUrl}/handover-early-ni`)
  }
})


router.post(`${baseUrl}/claimant-gender-router`, (req, res) => {
  const claimantGender = req.session.data['partner-check-yn']

  if (claimantGender === 'Yes, we live together') {
    res.redirect(`${baseUrl}/partner-dob`)
  } else {
    res.redirect(`${baseUrl}/children-check-yn`)
  }
})

router.post(`${baseUrl}/partner-gender-router`, (req, res) => {
  const claimantGender = req.session.data['partner-check-yn']

  if (claimantGender === 'Yes, we live together') {
    res.redirect(`${baseUrl}/partner-dob`)
  } else {
    res.redirect(`${baseUrl}/children-check-yn`)
  }
})

router.post(`${baseUrl}/partner-check-yn-router`, (req, res) => {
  const partnerCheck = req.session.data['partner-check-yn']

  if (partnerCheck === 'Yes, we live together') {
    res.redirect(`${baseUrl}/claimant-dob`)
  } else {
    res.redirect(`${baseUrl}/claimant-dob`)
  }
})

router.post(`${baseUrl}/partner-mac-yn-router`, (req, res) => {
  const macPartnerCheck = req.session.data['partner-mac-yn']

  if (macPartnerCheck === 'Yes') {
    res.redirect(`${baseUrl}/children-check-yn`)
  } else {
    res.redirect(`${baseUrl}/done-partner`)
  }
})


router.post(`${baseUrl}/housing-costs-router`, (req, res) => {
  const housingCosts = req.session.data['housing-costs']

  if (housingCosts === 'Yes') {
    res.redirect(`${baseUrl}/cya`)
  } else {
    res.redirect(`${baseUrl}/data-we-use`)
  }
})


router.post(`${baseUrl}/benefit-check-router`, (req, res) => {
  const benefitCheck = req.session.data['benefit-check']

  if (benefitCheck == 'SP') {
    res.redirect(`${baseUrl}/outcome`)
  } else {
    res.redirect(`${baseUrl}/benefit-aa-dla-pip`)
  }
})

router.post(`${baseUrl}/partner-benefit-check-router`, (req, res) => {
  const benefitCheck = req.session.data['benefit-check']

  if (benefitCheck == 'SP') {
    res.redirect(`${baseUrl}/outcome`)
  } else {
    res.redirect(`${baseUrl}/partner-income-separate`)
  }
})

router.post(`${baseUrl}/children-check-yn-router`, (req, res) => {
  const childrenCheck = req.session.data['children-check-yn']

  if (childrenCheck === 'Yes') {
    res.redirect(`${baseUrl}/children-ctc`)
  } else {
    res.redirect(`${baseUrl}/housing-type`)
  }
})

router.post(`${baseUrl}/children-ctc-router`, (req, res) => {
  const childrenCTC = req.session.data['children-ctc']

  if (childrenCTC == 'Yes') {
    res.redirect(`${baseUrl}/system-children-mac-check`)
  } else {
    res.redirect(`${baseUrl}/system-children-mac-check`)
  }
})

router.post(`${baseUrl}/type-of-claim-router`, (req, res) => {
  const typeOfClaim = req.session.data['type-of-claim']

  if (typeOfClaim == 'eligibility') {
    res.redirect(`${baseUrl}/start`)
  }  else if (typeOfClaim == 'bau-exit') {
      res.redirect(`${baseUrl}/bau-exit`)
    } else {
    res.redirect(`${baseUrl}/bau-exit`)
  }
})


router.post(`${baseUrl}/state-pension-amount-check`, (req, res) => {
  const statePensionAmount = req.session.data['state-pension-amount-check']

  if (statePensionAmount == 'Yes') {
    res.redirect(`${baseUrl}/benefit-check`)
  }  else if (statePensionAmount == 'No') {
      res.redirect(`${baseUrl}/state-pension-status`)
    } else {
    res.redirect(`${baseUrl}/xxx`)
  }
})

router.post(`${baseUrl}/partner-state-pension-amount-check`, (req, res) => {
  const partnerStatePensionAmount = req.session.data['partner-state-pension-amount-check']

  if (partnerStatePensionAmount == 'Yes') {
    res.redirect(`${baseUrl}/partner-benefit-check`)
  }  else if (partnerStatePensionAmount == 'No') {
      res.redirect(`${baseUrl}/partner-state-pension-status`)
    } else {
    res.redirect(`${baseUrl}/xxx`)
  }
})


router.post(`${baseUrl}/state-pension-status-router`, (req, res) => {
  const statePensionStatus = req.session.data['state-pension-status']

  if (statePensionStatus === 'entitled-to-zero') {
    res.redirect(`${baseUrl}/benefit-check`)
  } else if (statePensionStatus === 'not-applied-sp') {
    res.redirect(`${baseUrl}/cya`)
  } else if (statePensionStatus === 'waiting-for-first-payment') {
    res.redirect(`${baseUrl}/cya`)
  } else {
    res.redirect(`${baseUrl}/XXX`)
  }
})

router.post(`${baseUrl}/partner-state-pension-status-router`, (req, res) => {
  const partnerStatePensionStatus = req.session.data['partner-state-pension-status']

  if (partnerStatePensionStatus === 'entitled-to-zero') {
    res.redirect(`${baseUrl}/partner-benefit-check`)
  } else if (partnerStatePensionStatus === 'not-applied-sp') {
    res.redirect(`${baseUrl}/system-outcome-selector-page`)
  } else if (partnerStatePensionStatus === 'waiting-for-first-payment') {
    res.redirect(`${baseUrl}/system-outcome-selector-page`)
  } else {
    res.redirect(`${baseUrl}/XXX`)
  }
})



router.post(`${baseUrl}/partner-state-pension-status-router`, (req, res) => {
  const partnerStatePensionStatus = req.session.data['partner-state-pension-status']

  if (partnerStatePensionStatus === 'Yes') {
    res.redirect(`${baseUrl}/partner-state-pension-amount`)
  } else if (partnerStatePensionStatus === 'NoBank') {
    res.redirect(`${baseUrl}/partner-benefit-check`)
  } else if (partnerStatePensionStatus === 'no') {
    res.redirect(`${baseUrl}/state-pension-status`)
  } else {
    res.redirect(`${baseUrl}/cya`)
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

  if (outcomeRadios === 'housing-costs') {
    res.redirect(`${baseUrl}/handover`)
  } else if (outcomeRadios === 'help') {
    res.redirect(`${baseUrl}/more-help`)
  } else if (outcomeRadios === 'exit') {
    res.redirect(`${baseUrl}/exit`)
  } else if (outcomeRadios === 'children') {
    res.redirect(`${baseUrl}/handover-early-children`)
  } else if (outcomeRadios === 'mac') {
    res.redirect(`${baseUrl}/handover-early-mac`)
  } else if (outcomeRadios === 'sp-not-claimed') {
    res.redirect(`${baseUrl}/handover-early-sp`)
  } else if (outcomeRadios === 'joint-sp-not-claimed') {
    res.redirect(`${baseUrl}/handover-early-sp`)

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


// router.post(`${baseUrl}/outcome-yn-router`, (req, res) => {
//   const outcomeYN = req.session.data['outcome-yn']
//
//   if (outcomeYN === 'Yes') {
//     res.redirect(`${baseUrl}/more-help`)
//   } else {
//     res.redirect(`${baseUrl}/exit`)
//   }
// })
//
//
router.post(`${baseUrl}/system-outcome-selector`, (req, res) => {
  const outcomeSelector = req.session.data['system-outcome-selector']

  if (outcomeSelector == 'XXX') {
    res.redirect(`${baseUrl}/XXX`)
  } else if (outcomeSelector === 'XXX') {
    res.redirect(`${baseUrl}/outcome`)
  } else {
    res.redirect(`${baseUrl}/outcome`)
  }
})


router.post(`${baseUrl}/cya-outcome`, (req, res) => {
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




module.exports = router
