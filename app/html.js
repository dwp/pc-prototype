'use strict';

const minifyHtml = html => {
  return html
    .replace(/\s*>\s*/g, '>')
    .replace(/\s*<\s*/g, '<')
    .replace('\n', '')
    .replace(/\s{2,}/g, ' ');
};

const html = (strings, ...expressions) => {
  return strings.reduce((acc, val, index) => {
    return acc + minifyHtml(val + (expressions[index] || ''));
  }, '');
};

module.exports = html;
