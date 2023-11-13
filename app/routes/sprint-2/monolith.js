const express = require('express')

const router = new express.Router()
const baseUrl = '/sprint-2/monolith'

const manyThing = (baseUrl, thingName) => {
  const router = new express.Router()
  const pluralThing = thingName + 's'

  router.post(`${baseUrl}/add-${thingName}`, (req, res) => {
    req.session.data[pluralThing] = req.session.data[pluralThing] || []
    req.session.data[pluralThing].push(req.body)
    res.redirect(`${baseUrl}/index#${pluralThing}`)
  })

  router.get(`${baseUrl}/change-${thingName}/:${thingName}`, (req, res) => {
    req.session.data[pluralThing] = req.session.data[pluralThing] || []
    const thingIndex = parseInt(req.params[thingName], 10)
    const thing = req.session.data[pluralThing][thingIndex]

    if (!thing) {
      return res.redirect(`${baseUrl}/index`)
    }

    res.render(`sprint-2/monolith/add-${thingName}.html`, { [thingName]: thing })
  })

  router.post(`${baseUrl}/change-${thingName}/:${thingName}`, (req, res) => {
    const thingIndex = parseInt(req.params[thingName], 10)
    req.session.data[pluralThing] = req.session.data[pluralThing] || []
    req.session.data[pluralThing][thingIndex] = req.body
    res.redirect(`${baseUrl}/index#${pluralThing}`)
  })

  return router
}

router.use(manyThing(baseUrl, 'admission'))
router.use(manyThing(baseUrl, 'member'))
router.use(manyThing(baseUrl, 'employment'))
router.use(manyThing(baseUrl, 'pension'))
router.use(manyThing(baseUrl, 'saving'))
router.use(manyThing(baseUrl, 'investment'))
router.use(manyThing(baseUrl, 'share'))
router.use(manyThing(baseUrl, 'benefit'))

module.exports = router
