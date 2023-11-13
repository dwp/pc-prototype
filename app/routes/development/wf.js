const express = require('express')
const router = new express.Router()
const baseUrl = '/development/winter-fuel'


router.post(`${baseUrl}/payment-letter-router`, (req, res) => { // router name
  const privacyPolicy = req.session.data['payment-letter-yn']  // name of data / id name

  if (privacyPolicy === 'Yes') { // name of data / + answer
    res.redirect(`${baseUrl}/has-letter`)
  } else {
    res.redirect(`${baseUrl}/post-code-lookup`)
  }
})


module.exports = router
