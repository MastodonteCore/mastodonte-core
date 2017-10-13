const Scrap = require('../models/Scrap')
const Promise = require('bluebird')
const request = require('request')
const cheerio = require('cheerio')
const _ = require('lodash');
const sanitizeHtml = require('sanitize-html')
const sanitizeHtmlOptions = {
  allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'article'],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src', 'class']
  },
  transformTags: {
    'img': function(tagName, attribs) {
      return {
        tagName,
        attribs: {
          src: attribs.src,
          class: 'img-responsive'
        }
      }
    }
  }
}

exports.getIndex = () => {
  return new Promise((resolve, reject) => {
    Scrap.find({}, (err, scraps) => {
      if (err) return reject(err)
      resolve(scraps)
    })
  })
}

exports.getScrap = getScrap = (id) => {
  return new Promise((resolve, reject) => {
    Scrap.findOne({ _id: id }, (err, scrap) => {
      if (err) return reject(err)
      resolve(scrap)
    })
  })
}

exports.getScraping = (id) => {
  return new Promise((resolve, reject) => {
    getScrap(id)
      .then(scrap => {
        request.get(scrap.url, (err, response, body) => {
          if (err) return reject(err);

          const html = buildHtml(body, scrap.fields)

          resolve({ scrap, html })
        })
      })
  })
}

exports.postNew = (req) => {
  return new Promise((resolve, reject) => {
    const errors = validationScrap(req)

    if (errors) return reject(errors)

    const { name, url, field, typeField, parent } = req.body
    const fields = field.map((f, i) => ({
      selector: f,
      type: typeField[i],
      parent: parent[i]
    }))
    const scrap = new Scrap({
      name,
      url,
      fields
    })

    scrap.save((err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

exports.postUpdate = (req) => {
  return new Promise((resolve, reject) => {
    const errors = validationScrap(req)

    if (errors) return reject(errors)

    const { name, url, field, typeField, parent } = req.body;
    const fields = field.map((f, i) => ({
      selector: f,
      type: typeField[i],
      parent: parent[i]
    }))

    Scrap.findOne({ _id: req.params.id }, (err, scrap) => {
      if (err) return reject(err)

      scrap['name'] = name
      scrap['url'] = url
      scrap['fields'] = fields

      scrap.save((err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  })
}

function validationScrap(req) {
  req.assert('name', 'Name is empty').notEmpty()
  req.assert('url', 'URL is wrong format').isURL()

  return req.validationErrors()
}

function buildHtml(body, fields) {
  let html = [];
  const $ = cheerio.load(body);
  const selectorsGrouped = _.mapValues(_.groupBy(fields, 'parent'), list => {
    return list.map(field => _.omit(field, 'parent'))
  })

  for (let parent in selectorsGrouped) {
    const selectors = selectorsGrouped[parent];

    if (parent == '') {
      buildHtmlWithoutParentSelector($, selectors, html)
    } else {
      buildHtmlWithParentSelector($, selectors, parent, html)
    }
  }
  return html
}

function buildHtmlWithoutParentSelector($, selectors, html) {
  selectors.forEach(s => {
    const $selector = $(s.selector)
    $selector.each((i, element) => {
      const $div = $('<div/>')

      $div.append(selectContent($, element, s.type))
      html.push(cleanHtml($, $div))
    })
  })
}

function buildHtmlWithParentSelector($, selectors, parent, html) {
  const $parentSelector = $(parent);

  $parentSelector.each((i, element) => {
    const $div = $('<div/>')
    const $element = $(element)

    selectors.forEach(s => {
      const $selector = $element.find(s.selector)

      $selector.each((i, el) => {
        $div.append(selectContent($, el, s.type))
      })
    })

    html.push(cleanHtml($, $div))
  })
}

function cleanHtml($, $el) {
  return sanitizeHtml($.html($el), sanitizeHtmlOptions)
}

function selectContent($, el, type) {
  if (type == 'html') {
    return $.html(el)
  } else {
    return $(el).text()
  }
}