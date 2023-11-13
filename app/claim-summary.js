'use strict'

const {formatDate} = require('./filters')()

class ClaimSummary {
  constructor(heading, agentName) {
    this.heading = heading
    this.agent = agentName
    this.date = formatDate()
    this.sections = []
  }

  addSection(sectionName, sectionData = []) {
    this.sections.push({
      heading: sectionName,
      fields: sectionData
    })
  }

  addFieldToSection(sectionName, sectionData) {
    const index = this.sections.findIndex(section => section.heading === sectionName);
    const fields = Array.isArray(sectionData) ? sectionData : [sectionData]
    this.sections[index].fields.push(...fields)
  }
}

module.exports = ClaimSummary;
