const Promise = require('bluebird')
const { htmlToPdf } = require('../../pdf/services/pdf');

module.exports = (app) => {
  const Scrap = app.get('model');
  const scrapService = app.get('service');

  return {
    getIndex() {
      return new Promise((resolve, reject) => {
        Scrap.find({}, (err, scraps) => {
          if (err) return reject(err)
          return resolve(scraps)
        })
      })
    },
    getScrap: getScrap = (id) => {
      return new Promise((resolve, reject) => {
        Scrap.findOne({ _id: id }, (err, scrap) => {
          if (err) return reject(err)
          return resolve(scrap)
        })
      })
    },
    getScraping: getScraping = (id) => {
      let scrapSelected;

      return getScrap(id)
        .then(scrap => scrapSelected = scrap)
        .then(() => {
          const { url, fields } = scrapSelected;
          return scrapService(url, fields);
        })
        .then(html => ({ scrap: scrapSelected, html }))
    },
    exportScrap(id) {
      return getScraping(id)
        .then(s => htmlToPdf({
          title: s.scrap.name,
          html: s.html
        }))
    },
    postNew(req) {
      return new Promise((resolve, reject) => {
        const errors = validationScrap(req)

        if (errors) return reject(errors)

        const { name, url, field, typeField, parent, unique = [] } = req.body
        const fields = field.map((f, i) => ({
          selector: f,
          type: typeField[i],
          parent: parent[i],
          unique: unique.indexOf(i.toString()) >= 0
        }))
        const scrap = new Scrap({
          name,
          url,
          fields
        })

        scrap.save((err) => {
          if (err) return reject(err)
          return resolve()
        })
      })
    },
    updateScrap(req) {
      return new Promise((resolve, reject) => {
        const errors = validationScrap(req)

        if (errors) return reject(errors)

        const { name, url, field, typeField, parent, unique = [] } = req.body;

        const fields = field.map((f, i) => ({
          selector: f,
          type: typeField[i],
          parent: parent[i],
          unique: unique.indexOf(i.toString()) >= 0
        }))

        Scrap.findOne({ _id: req.params.id }, (err, scrap) => {
          if (err) return reject(err)

          scrap['name'] = name
          scrap['url'] = url
          scrap['fields'] = fields

          scrap.save((err) => {
            if (err) return reject(err)
            return resolve()
          })
        })
      })
    },
    deleteScrap(req) {
      return new Promise((resolve, reject) => {
        Scrap.remove({ _id: req.params.id }, (err) => {
          if (err) return reject(err);

          return resolve()
        })
      })
    }
  }
}

function validationScrap(req) {
  req.assert('name', 'Name is empty').notEmpty()
  req.assert('url', 'URL is wrong format').isURL()

  return req.validationErrors()
}