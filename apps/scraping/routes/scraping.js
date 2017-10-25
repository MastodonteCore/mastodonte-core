const express = require('express');
const router = express.Router();
const scrapController = require('../controllers/scraping');

/**
 * Scrap routes.
 */
router.get('/', (req, res, next) => {
  return scrapController.getIndex()
    .then(scraps => {
      res.render('index', {
        title: 'Scraping',
        scraps
      })
    })
})

router.get('/new', (req, res, next) => {
  return res.render('new', {
    title: 'New scrap'
  })
})


router.get('/:id', (req, res, next) => {
  return scrapController.getScraping(req.params.id)
    .then(result => {
      const { scrap, html } = result;

      res.render('view', {
        title: scrap.name,
        scrap,
        html
      })
    })
})

router.get('/:id/pdf', (req, res, next) => {
  return scrapController.exportScrap(req.params.id)
    .then((pdfPath) => res.sendFile(pdfPath))
})

router.post('/new', (req, res, next) => {
  return scrapController.postNew(req)
    .then(() => res.redirect(scrapingApp.path()))
    .catch(errors => {
      req.flash('errors', errors);
      return res.redirect(`${scrapingApp.path}/new`);
    })
})

router.get('/edit/:id', (req, res, next) => {
  return scrapController.getScrap(req.params.id)
    .then(scrap => res.render('edit', {
      title: `${scrap.name} edit`,
      scrap
    }))
    .catch(error => {
      req.flash('errors', error);
      return res.redirect(scrapingApp.path())
    })
})

router.post('/edit/:id', (req, res, next) => {
  return scrapController.updateScrap(req)
    .then(() => res.redirect(scrapingApp.path()))
    .catch(errors => {
      req.flash('errors', errors);
      return res.redirect(`${scrapingApp.path()}/edit/${req.params.id}`)
    })
})

router.delete('/delete/:id', (req, res, next) => {
  return scrapController.deleteScrap(req)
    .then(() => res.redirect(scrapingApp.path()))
    .catch(errors => {
      req.flash('errors', errors);
      return res.redirect(`${scrapingApp.path()}/${req.params.id}`)
    })
})

/**
 * API Scrap routes
 */
router.get('/api', (req, res, next) => {
  return scrapController.getIndex()
    .then(scraps => {
      res.json({ scraps })
    })
})

router.get('/api/:id', (req, res, next) => {
  return scrapController.getScraping(req.params.id)
    .then(html => {
      res.json({ html })
    })
    .catch(errors => {
      res.json({ errors })
    })
})

router.post('/api/new', (req, res, next) => {
  return scrapController.postNew(req)
    .then(resp => {
      res.json({ resp })
    })
    .catch(errors => {
      res.json({ errors })
    })
})

module.exports = router