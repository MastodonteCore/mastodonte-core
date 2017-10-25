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
  return pdfController.buildPdfByHtml(req)
    .then((pdfPath) => res.sendFile(pdfPath))
})

router.delete('/delete', (req, res, next) => {
  return pdfController.deletePdf(req)
    .then(() => res.send('PDF deleted with success'))
})

router.post('/api/html', (req, res, next) => {
  return pdfController.buildPdfByHtml(req)
    .then((pathPdf) => res.sendFile(pathPdf))
})

router.post('/api/url', (req, res, next) => {
  return pdfController.buildPdfByUrl(req)
    .then(() => res.status(200).end())
})

router.delete('/api/delete', (req, res, next) => {
  return pdfController.deletePdf(req)
    .then(() => res.status(200).end())
})

router.get('/:pdf_name', (req, res, next) => {
  return pdfController.getPdf(req.params.pdf_name)
    .then((pdfPath) => res.sendFile(pdfPath))
})

module.exports = router;