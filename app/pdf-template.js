'use strict'

const html = require('./html')

const escapeHtml = string => {
  if (!string) {
    return ''
  }

  return string
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n+/g, '<br/>')
}

const renderSections = section => html`
  <div class="section">
    <h2 class="section-header">
      ${escapeHtml(section.heading)}
    </h2>
    ${section.fields.map(renderFields).join('')}
  </div>
`

const renderFields = field => field.value ? html`
  <h3 class="field-name">
    ${escapeHtml(field.key)}
  </h3>
  <p class="field-value">
    ${escapeHtml(Array.isArray(field.value) ? field.value.join(', ') : field.value || '—')}
  </p>
  ${field.furtherAction && html`
    <p class="action-required circle"><span>Further action required</span></p>
  `}
  <hr/>
` : ''

const template = data => html`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8"/>
      <title>${data.heading}</title>
      <style type="text/css">
        body {
          font: normal 8pt/1.375em 'FreeSans', sans-serif;
          margin: 12mm;
          width: 186mm;
        }

        .header {
          margin-bottom: 8mm;
        }

        .header h1 {
          font: normal 2em/0.5 'FreeSansBold', sans-serif;
          margin: 0;
          float: right;
          width: 141mm;
        }

        .document-meta {
          margin: 0;
          width: 41mm;
        }

        .document-meta::after {
          content: "";
          display: block;
          clear: both;
        }

        .document-meta dt,
        .document-meta dd {
          float: left;
          margin: 0;
        }

        .document-meta dt {
          clear: left;
        }

        .document-meta dt::after {
          content: ':';
          padding-right: .5em;
        }

        .further-action {
          margin: 0;
          text-align: right;
        }

        .section-header, .field-name {
          font: normal 1em/1.375em 'FreeSansBold', sans-serif;
          width: 41mm;
          margin: 0 4mm 0 0;
        }

        .section-header, .field-name, .field-value, .action-required {
          float: left;
          padding: 4mm 0;
          page-break-inside: avoid;
        }

        .section-header {
          clear: left;
        }

        .field-name {
          margin-left: 45mm;
        }

        .section-header + .field-name {
          margin-left: 0;
        }

        .field-value {
          width: 79mm;
          margin: 0 10mm 0 0;
        }

        .action-required {
          width: 7mm;
          margin: 0;
        }

        .action-required span {
          position: absolute;
          display: block;
          width: 0;
          height: 0;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .circle::after {
          content: "";
          width: 4mm;
          height: 4mm;
          display: inline-block;
          border-radius: 4mm;
          background: #000;
          margin: -0.3mm 0 0 3mm;
          vertical-align: middle;
        }

        hr {
          border: 0;
          border-top: .0625em solid #000;
          margin: 0 0 0 45mm;
          clear: left;
        }

        .section {
          clear: both;
          margin: 0 0 8mm;
        }

        .section:last-child {
          margin: 0;
        }

        @page {
          size: A4 portrait;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.heading}</h1>
        <dl class="document-meta">
          <dt class="document-meta__field">Date</dt>
          <dd class="document-meta__value">${data.date}</dd>
          <dt class="document-meta__field">Agent</dt>
          <dd class="document-meta__value">${data.agent}</dd>
        </dl>
      </div>
      <p class="further-action circle" aria-hidden="true">Further action:</p>
      ${data.sections.map(renderSections).join('')}
    </body>
  </html>
`

module.exports = template
