const nunjucks = require('nunjucks');

module.exports = function(core, module) {
  if (!module.get('view engine')) {
    nunjucks.configure([core.get('views'), module.get('views')], { autoescape: true, express: module });
  }

  core.use(`/${a}`, module);
}