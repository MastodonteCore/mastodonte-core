const Promise = require('bluebird')
const request = require('request')
const cheerio = require('cheerio')
const _ = require('lodash')
const { getBaseUrl, resolveUrl } = require('../utils/url')
const sanitizeHtml = require('../utils/sanitizeHtml')

let BASE_URL, $;

function buildHtml(body, fields) {
  let html = [];
  const selectorsGrouped = _.mapValues(_.groupBy(fields, 'parent'), list => {
    return list.map(field => _.omit(field, 'parent'))
  })

  $ = cheerio.load(body);

  for (let parent in selectorsGrouped) {
    const selectors = selectorsGrouped[parent];

    if (parent == '') {
      buildHtmlWithoutParentSelector(selectors, html)
    } else {
      buildHtmlWithParentSelector(selectors, html, parent)
    }
  }
  return html
}

function buildHtmlWithoutParentSelector(selectors, html) {
  selectors.forEach(s => {
    const { selector, type, unique } = s;
    const $selector = $(selector)
    const $container = $('<div/>')

    prepareContent($selector, $container, type, unique)
    html.push(cleanHtml($container))
  })
}

function buildHtmlWithParentSelector(selectors, html, parent) {
  const $parentSelector = $(parent)

  $parentSelector.each((i, element) => {
    const $container = $('<div/>')
    const $element = $(element)

    selectors.forEach(s => {
      const { selector, type, unique } = s;
      const $selector = $element.find(selector)

      prepareContent($selector, $container, type, unique)
    })

    html.push(cleanHtml($container))
  })
}

function prepareContent($selector, $container, type, isUnique) {
  $selector.each((i, element) => {
    if (i > 0 && isUnique) return

    $container.append(selectContent(element, type))
  })
}

function selectContent(el, type) {
  if (type == 'html') {
    return $.html(el)
  } else if (type == 'link') {
    const href = $(el).attr('href')
    const urlComplete = resolveUrl(href, BASE_URL)
    const $div = $('<div/>')
    const $link = $(`<a />`).attr('href', urlComplete).text(href)
    
    $div.append($link)
    return $div;
  } else {
    return $(el).text()
  }
}

function cleanHtml($el) {
  return sanitizeHtml($.html($el))
}

module.exports = function(url, selectors) {
  BASE_URL = getBaseUrl(url);

  return new Promise((resolve, reject) => {
    request.get(url, (err, response, body) => {
      if (err) return reject(err);

      const html = buildHtml(body, selectors)

      resolve(html)
    })
  })
}