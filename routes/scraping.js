const express = require('express');
const router = express.Router();
const scrapController = require('../controllers/scraping');

/**
 * Scrap routes.
 */
router.get('/', (req, res, next) => {
  scrapController.getIndex()
    .then(scraps => {
      res.render('scraping/index', {
        title: 'Scraping',
        scraps
      })
    })
})

router.get('/new', (req, res, next) => {
  return res.render('scraping/new', {
    title: 'New scrap'
  })
})


router.get('/:id', (req, res, next) => {
  scrapController.getScraping(req.params.id)
    .then(result => {
      const { scrap, html } = result;

      res.render('scraping/view', {
        title: scrap.name,
        scrap,
        html
      })
    })
})

router.post('/new', (req, res, next) => {
  scrapController.postNew(req)
    .then(() => res.redirect('/scraping'))
    .catch(errors => {
      req.flash('errors', errors);
      return res.redirect('/scraping/new');
    })
})

router.get('/edit/:id', (req, res, next) => {
  scrapController.getScrap(req.params.id)
    .then(scrap => res.render('scraping/edit', {
      title: `${scrap.name} edit`,
      scrap
    }))
    .catch(error => {
      req.flash('errors', error);
      return res.redirect('/scraping')
    })
})

router.post('/edit/:id', (req, res, next) => {
  scrapController.postUpdate(req)
    .then(() => res.redirect('/scraping'))
    .catch(errors => {
      req.flash('errors', errors);
      return res.redirect(`/scraping/edit/${req.params.id}`)
    })
})

/**
 * API Scrap routes
 */
router.get('/api', (req, res, next) => {
  scrapController.getIndex()
    .then(scraps => {
      res.json({ scraps })
    })
})

router.get('/api/:id', (req, res, next) => {
  scrapController.getScraping(req.params.id)
    .then(html => {
      res.json({ html })
    })
    .catch(errors => {
      res.json({ errors })
    })
})

router.post('/api/new', (req, res, next) => {
  scrapController.postNew(req)
    .then(resp => {
      res.json({ resp })
    })
    .catch(errors => {
      res.json({ errors })
    })
})

module.exports = router