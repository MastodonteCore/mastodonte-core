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
    'img': function (tagName, attribs) {
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

module.exports = function(html) {
  return sanitizeHtml(html, sanitizeHtmlOptions)
}