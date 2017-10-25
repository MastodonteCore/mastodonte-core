const Promise = require('bluebird')
const { htmlToPdf, urlToPdf } = require('../services/pdf')
const path = require('path');
const fs = require('fs');

exports.getListPdf = () => {
  return new Promise((resolve, reject) => {
    const pdfPath = path.join(__dirname, '../public/pdf')

    fs.readdir(pdfPath, (err, pdfs) => {
      if (err) return reject(err)

      return resolve(pdfs)
    })
  })
}

exports.getPdf = getPdf = (pdfName) => {
  return new Promise((resolve, reject) => {
    const pdfPath = path.join(__dirname, `../public/pdf/${pdfName}`);

    if (fs.existsSync(pdfPath)) {
      return resolve(pdfPath)
    } else {
      return reject()
    }
  })
}

exports.buildPdfByHtml = (req) => {
  const { html, title } = req.body;

  return htmlToPdf({ html, title });
}

exports.buildPdfByUrl = (req) => {
  const { url, title } = req.body;

  return urlToPdf({ url, title });
}

exports.deletePdf = (req) => {
  const { pdfs } = req.body;

  return Promise.all(pdfs.map(file => {
    return getPdf(file)
      .then(pdfPath => fs.unlinkSync(pdfPath))
  }))
}