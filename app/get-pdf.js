'use strict'

const fs = require('fs')
const path = require('path')
const got = require('got')
const template = require('./pdf-template')

const base64Encode = data => Buffer.from(data).toString('base64');
const encodedFreeSans = base64Encode(fs.readFileSync('./app/assets/fonts/FreeSans.ttf'))
const encodedFreeSansBold = base64Encode(fs.readFileSync('./app/assets/fonts/FreeSansBold.ttf'))

const getPDF = async data => {
  const encodedHtml = base64Encode(template(data));

  const response = await got.post('https://do-a-pdf.herokuapp.com/generatePdf', {
    body: JSON.stringify({
      font_map: {
        FreeSans: encodedFreeSans,
        FreeSansBold: encodedFreeSansBold
      },
      page_html: encodedHtml,
      conformance_level: 'PDFA_1_A'
    })
  })

  const pdf = Buffer.from(response.body, 'base64')

  return pdf
}

module.exports = getPDF
