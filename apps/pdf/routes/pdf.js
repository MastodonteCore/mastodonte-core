const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf');

router.get('/', (req, res, next) => {
  return pdfController.getListPdf()
    .then((pdfs) => res.render('index', {
      title: 'List PDFs',
      pdfs
    }))
})

router.get('/new', (req, res, next) => {
  return res.render('new', {
    title: 'PDF'
  })
})

router.post('/new', (req, res, next) => {
  return pdfController.buildPdf(req)
    .then((pdfPath) => res.sendfile(pdfPath))
})

router.post('/delete', (req, res, next) => {
  return pdfController.deletePdf(req)
    .then(() => {
      req.flash('success', 'PDF deleted with success')
      return res.redirect('/pdf');
    })
})

router.post('/api', (req, res, next) => {
  return pdfController.buildPdf(req)
    .then((pathPdf) => {
      res.sendfile(pathPdf)
    })
})

router.post('/api/delete', (req, res, next) => {
  return pdfController.deletePdf(req)
    .then(() => {
      return res.status(200).end()
    })
})

router.get('/:pdf_name', (req, res, next) => {
  return pdfController.getPdf(req.params.pdf_name)
    .then((pdfPath) => res.sendfile(pdfPath))
})

module.exports = router;