const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf');

router.get('/new', (req, res, next) => {
  return res.render('pdf/new', {
    title: 'PDF'
  })
})

router.post('/new', (req, res, next) => {
  return pdfController.buildPdf(req)
    .then((pathPdf) => {
      res.sendfile(pathPdf)
    })
})

router.post('/api', (req, res, next) => {
  return pdfController.buildPdf(req)
    .then((pathPdf) => {
      res.sendfile(pathPdf)
    })
})

module.exports = router;