const nunjucks = require('nunjucks');

export default function attachToExpressModule(core, module, appName = '') {
  if (!module.get('view engine')) {
    nunjucks.configure([core.get('views'), module.get('views')], { autoescape: true, express: module });
  }

  core.use(`/${appName}`, module);
}
