const Promise = require('bluebird');
const puppeteer = require('puppeteer');
const formatDate = require('../../../utils/formatDate');
const { formatFileName } = require('../../../utils/fileSystem');
const path = require('path');

let BROWSER, PAGE, PATH;

exports.htmlToPdf = (params) => {
  const { html, title } = params;
  const service = prepareService()
  const filename = formatFileName(title) || 'document';

  PATH = path.join(__dirname, `../public/pdf/${formatDate(Date.now())}_${filename}.pdf`);

  return service
    .then(() => PAGE.setContent(html))
    .then(() => PAGE.waitForNavigation({
      waitUntil: 'networkidle'
    }))
    .then(generatePdf)
}

exports.urlToPdf = (params) => {
  const { url, title } = params;
  const service = prepareService()
  const filename = formatFileName(title) || 'document';

  PATH = path.join(__dirname, `../public/pdf/${formatDate(Date.now())}_${filename}.pdf`);

  return service
    .then(() => PAGE.goto(url))
    .then(() => PAGE.waitForNavigation({
      waitUntil: 'networkidle'
    }))
    .then(generatePdf)
}

function prepareService() {
  return puppeteer.launch()
    .then(b => BROWSER = b)
    .then(() => BROWSER.newPage())
    .then(page => PAGE = page);
}

function generatePdf() {
  return PAGE.pdf({
    path: PATH,
    format: 'A4',
    margin: {
      top: '17mm',
      right: '17mm',
      bottom: '17mm',
      left: '17mm'
    }
  }).then(() => BROWSER.close())
    .then(() => PATH)
}