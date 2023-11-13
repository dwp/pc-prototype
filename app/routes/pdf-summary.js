const fs = require('fs')
const path = require('path')
const express = require('express')
const getPdf = require('../get-pdf')
const ClaimSummary = require('../claim-summary')
const {getMonth, formatNINO, formatMoney} = require('../filters')()

const router = new express.Router()

router.get('/get-summary-pdf', async (req, res, next) => {
  const formData = req.session.data
  const pdfHeading = `Pension Credit claim for: ${formData['full-name']}`
  const claimAgent = formData['agent'] || 'Dave'

  // Make new claim summary
  const pdfData = new ClaimSummary(pdfHeading, claimAgent)

  // Add eligibilty Section
  pdfData.addSection('Eligibility', [
    {
      key: 'Who are you claiming pension credit for?',
      value: formData['claiming-for']
    },
    {
      key: 'Name',
      value: formData['full-name']
    },
    {
      key: 'National Insurace number',
      value: formatNINO(formData['nino'])
    },
    {
      key: 'Date of birth',
      value: `${formData['dob-day']} ${getMonth(formData['dob-month'])} ${formData['dob-year']}`
    }
  ])

  // Add has a partner section
  pdfData.addSection('Partner', [
    {
      key: 'Do you have a partner?',
      value: formData['has-partner'],
      furtherAction: formData['has-partner'] === 'Yes'
    },
    {
      key: 'Partner notes',
      value: formData['partner-more-detail']
    }
  ])

  // Add residency section
  pdfData.addSection('Residency', [
    {
      key: 'Do you live in the UK?',
      value: formData['resides-in-uk'],
      furtherAction: formData['resides-in-uk'] === 'No'
    },
    {
      key: 'Have you lived in UK for 2 years?',
      value: formData['lived-abroad'],
      furtherAction:  formData['lived-abroad'] === 'No'
    },
    {
      key: 'Are you a UK National?',
      value: formData['uk-national'],
      furtherAction: formData['uk-national'] === 'No'
    }
  ])

  // Add contact details section
  pdfData.addSection('Contact information', [
    {
      key: 'Telephone number',
      value: formData['telephone-number']
    },
    {
      key: 'Mobile number',
      value: formData['mobile']
    },
    {
      key: 'Can text mobile',
      value: formData['can-text']
    },
    {
      key: 'Email address',
      value: formData['email']
    },
    {
      key: 'Home phone number',
      value: formData['landline']
    },
    {
      key: 'Accessability',
      value: formData['disabilities']
    }
  ])

  // Add address section
  pdfData.addSection('Address', [
    {
      key: 'Address',
      value: [
        '221B Baker Street',
        'Marylebone',
        'London'
      ]
    },
    {
      key: 'Postcode',
      value: 'NW1 5RT'
    }
  ])

  // Add partner details if has partner
  if (formData['has-partner'] === 'Yes' && formData['partner-more-detail']) {
    pdfData.addSection('Partner details', [{
      key: 'Partner details',
      value: formData['partner-more-detail']
    }])
  }

  // Add claim date section
  pdfData.addSection('Claim date', [{
    key: 'Date',
    value: formData['claim-date']
  }])

  // Add home owndership section
  pdfData.addSection('Home ownership', [{
    key: 'Home ownership',
    value: formData['home-ownership']
  }])

  // If they own their home, add ground rent etc
  if (formData['home-ownership'] === 'Owned') {
    pdfData.addFieldToSection('Home ownership', [
      {
        key: 'Ground rent',
        value: formData['ground-rent'] ? formatMoney(formData['ground-rent']) : 'None'
      },
      {
        key: 'Service charges',
        value: formData['service-charges'] ? formatMoney(formData['service-charges']) : 'None'
      },
      {
        key: 'Mortgage',
        value: formData['has-mortgage'] || 'No'
      },
      {
        key: 'Council tax reduction',
        value: formData['owns-council-tax']
      }
    ])
  }

  // If they rent a property
  if (formData['home-ownership'] == 'Rented') {
    pdfData.addFieldToSection('Home ownership', [
      {
        key: 'Rent and service charges',
        value: formData['rentServiceCharges']
      },
      {
        key: 'In receipt housing benefit and council tax reduction',
        value: formData['rent-housing-council-tax']
      }
    ])
  }

  // If they're in shelted accomodation
  if (formData['home-ownership'] == 'Sheltered Accommodation') {
    pdfData.addFieldToSection('Home ownership', {
      key: 'Sheletered accomdation notes',
      value: formData['sheltered-more-detail']
    })
  }

  // If they live in someone else's house
  if (formData['home-ownership'] == 'Someone Else') {
    pdfData.addFieldToSection('Home ownership', {
      key: 'Someone else notes',
      value: formData['someone-else-more-detail']
    })
  }

  // If they live in some other place
  if (formData['home-ownership'] == 'Other') {
    pdfData.addFieldToSection('Home ownership', {
      key: 'Other place notes',
      value: formData['Other']
    })
  }

  // Add claim others in household
  pdfData.addSection('Others in household', [{
    key: 'Details',
    value: formData['household-more-detail']
  }])

  // Add claim others in household
  pdfData.addSection('Hospital admissions', [{
    key: 'Have you spent any time in hospital since',
    value: formData['hospital-yn']
  }])

  // If they have been in hospital
  if (formData['hospital-yn'] == 'Yes') {
    pdfData.addFieldToSection('Hospital admissions', {
      key: 'Details',
      value: formData['hospital-more-detail']
    })
  }

  // If they're in a care home
  if (formData['home-ownership'] === 'Care Home') {
    pdfData.addSection('Care Home', {
      key: 'Details',
      value: formData['carehome-more-detail']
    })
  }

  // Other pensions information
  if (formData['otherPension-more-detail'] || formData['forignPension-more-detail']) {
    pdfData.addSection('Other pensions and notional income', [
      {
        key: 'Other pension details',
        value: formData['otherPension-more-detail']
      },
      {
        key: 'Foreign pension details',
        value: formData['otherPension-more-detail']
      }
    ])
  }

  // Money, savings and investments
  if (formData["over-10k"] === 'Yes') {
    pdfData.addSection('Money, savings and investments', [
      {
        key: 'Details',
        value: formData['MoneyOver10k-more-detail']
      }
    ])
  } else {
    pdfData.addSection('Money, savings and investments', [
      {
        key: 'Total',
        value: formatMoney(formData["total-amount"])
      }
    ])
  }

  // Self-employment information
  if (formData['selfEmployment-more-detail']) {
    pdfData.addSection('Self-employment information', [{
      key: 'Details',
      value: formData['selfEmployment-more-detail']
    }])
  }

  // Other income
  if (formData['otherIncome-more-detail']) {
    pdfData.addSection('Other income', [{
      key: 'Details',
      value: formData['otherIncome-more-detail']
    }])
  }

  // Bank details
  pdfData.addSection('Payment details', [
    {
      key: 'Name on account',
      value: formData['name-on-account']
    },
    {
      key: 'Name on account',
      value: formData['name-on-int-account']
    },
    {
      key: 'Sort code',
      value: formData['sort-code']
    },
    {
      key: 'Account number',
      value: formData['account-number']
    },
    {
      key: 'Roll number',
      value: formData['roll-number']
    },
    {
      key: 'SWIFT code',
      value: formData['swift-code']
    },
    {
      key: 'IBAN',
      value: formData['iban-number']
    },
  ])

  try {
    const pdf = await getPdf(pdfData)
    res.setHeader('Content-disposition', 'attachment; filename=eligibility.pdf')
    res.setHeader('Content-type', 'application/pdf')
    res.send(pdf)
  } catch (error) {
    next(error)
  }
})

module.exports = router
