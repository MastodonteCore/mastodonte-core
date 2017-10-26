const Promise = require('bluebird')
const path = require('path');
const fs = require('fs');

module.exports = (app) => {
  const { htmlToPdf, urlToPdf } = app.get('service');

  return {
    getListPdf() {
      return new Promise((resolve, reject) => {
        const pdfPath = path.join(__dirname, '../public/pdf')

        fs.readdir(pdfPath, (err, pdfs) => {
          if (err) return reject(err)

          return resolve(pdfs)
        })
      })
    },
    getPdf: getPdf = (pdfName) => {
      return new Promise((resolve, reject) => {
        const pdfPath = path.join(__dirname, `../public/pdf/${pdfName}`);

        if (fs.existsSync(pdfPath)) {
          return resolve(pdfPath)
        } else {
          return reject()
        }
      })
    },
    buildPdfByHtml(req) {
      const { html, title } = req.body;

      return htmlToPdf({ html, title });
    },
    buildPdfByUrl(req) {
      const { url, title } = req.body;

      return urlToPdf({ url, title });
    },
    deletePdf(req) {
      const { pdfs } = req.body;

      return Promise.all(pdfs.map(file => {
        return getPdf(file)
          .then(pdfPath => fs.unlinkSync(pdfPath))
      }))
    }
  }
}