const Promise = require('bluebird');
const puppeteer = require('puppeteer');
const formatDate = require('../utils/formatDate');
const { formatFileName } = require('../utils/file');
const path = require('path');

module.exports = function(params) {
  return new Promise((resolve, reject) => {

    let BROWSER, PAGE;
    const { html, title } = params;
    const filename = formatFileName(title) || 'document';
    const pathPdf = path.join(__dirname, `../public/pdf/${formatDate(Date.now())}_${filename}.pdf`);

    return puppeteer.launch()
      .then(browser => {
        BROWSER = browser
        return BROWSER.newPage()
      })
      .then(page => PAGE = page)
      .then(() => PAGE.setContent(html))
      .then(() => PAGE.pdf({
        path: pathPdf,
        format: 'A4',
        margin: {
          top: '17mm',
          right: '17mm',
          bottom: '17mm',
          left: '17mm'
        }
      }))
      .then(() => resolve(pathPdf))
      .catch(reject)
  })
}