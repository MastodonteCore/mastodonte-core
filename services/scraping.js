const Promise = require('bluebird')
const request = require('request')
const cheerio = require('cheerio')
const _ = require('lodash')
const { URL } = require('url');
const sanitizeHtml = require('../utils/sanitizeHtml')

let BASE_URL;

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
      buildHtmlWithParentSelector($, selectors, html, parent)
    }
  }
  return html
}

function buildHtmlWithoutParentSelector($, selectors, html) {
  selectors.forEach(s => {
    const $selector = $(s.selector)

    $selector.each((i, element) => {
      if (i > 0 && s.unique) return;
      const $div = $('<div/>')

      $div.append(selectContent($, element, s.type))
      html.push(cleanHtml($, $div))
    })
  })
}

function buildHtmlWithParentSelector($, selectors, html, parent) {
  const $parentSelector = $(parent);

  $parentSelector.each((i, element) => {
    const $div = $('<div/>')
    const $element = $(element)

    selectors.forEach(s => {
      const $selector = $element.find(s.selector)

      $selector.each((i, el) => {
        if (i > 0 && s.unique) return;
        $div.append(selectContent($, el, s.type))
      })
    })

    html.push(cleanHtml($, $div))
  })
}

function cleanHtml($, $el) {
  return sanitizeHtml($.html($el))
}

function selectContent($, el, type) {
  if (type == 'html') {
    return $.html(el)
  } else if (type == 'link') {
    const href = $(el).attr('href')
    const urlComplete = new URL(href, BASE_URL)
    const $div = $('<div/>');
    const $link = $(`<a />`).attr('href', urlComplete).text(href);
    
    $div.append($link);
    return $div;
  } else {
    return $(el).text()
  }
}

module.exports = function(url, selectors) {
  const u = new URL(url);

  BASE_URL = u.origin;

  return new Promise((resolve, reject) => {
    request.get(url, (err, response, body) => {
      if (err) return reject(err);

      const html = buildHtml(body, selectors)

      resolve(html)
    })
  })
}