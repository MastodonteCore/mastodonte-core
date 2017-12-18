const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const ts = require('gulp-typescript');
const gls = require('gulp-live-server');
const exec = require('child_process').exec;
const del = require('del');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const runSequence = require('run-sequence');
const wbBuild = require('workbox-build');

const isEnvProduction = process.NODE_ENV === 'production';
const tsProject = ts.createProject('tsconfig.json')

const dirs = {
  src: 'src',
  dest: 'dist',
};

const imagesPath = {
  src: `${dirs.src}/public/images/**/*`,
  dest: `${dirs.dest}/public/images/`,
};

const sassPaths = {
  src: `${dirs.src}/public/sass/main.scss`,
  dest: `${dirs.dest}/public/css/`,
};

const jsPaths = {
  src: `${dirs.src}/public/js/main.js`,
  dest: `${dirs.dest}/public/js/`,
};

const vendorSrc = [
  './node_modules/jquery/dist/jquery.js',
  './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
];

const cleanFolders = [
  'dist',
];

const filesToCopy = {
  public: [`${dirs.src}/public/favicon.png`, `${dirs.src}/public/sw.js`],
  views: `${dirs.src}/views/**/*`
};

const fontsPaths = {
  fontAwesome: {
    src: './node_modules/font-awesome/fonts/**/*',
    dest: `${dirs.dest}/public/fonts/fontAwesome/`,
  },
  bootstrap: {
    src: './node_modules/bootstrap-sass/assets/fonts/bootstrap/**/*',
    dest: `${dirs.dest}/public/fonts/bootstrap/`,
  },
};

gulp.task('dependencies-status', () => exec('npm outdated', (err, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  if (err) console.error(err);
}));

gulp.task('clean', () => del(cleanFolders));

gulp.task('images', () => gulp.src(imagesPath.src)
  .pipe(imagemin())
  .pipe(gulp.dest(imagesPath.dest)));

gulp.task('ts:backend', () => tsProject.src()
  .pipe(tsProject())
  .js.pipe(gulp.dest('dist')));

gulp.task('styles', () => gulp.src(sassPaths.src)
  .pipe(sourcemaps.init())
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(gulpif(isEnvProduction, cleanCss()))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(sassPaths.dest)));

gulp.task('js', () => {
  const bundler = browserify({
    entries: jsPaths.src,
    debug: true,
  });
  bundler.transform(babelify);

  return bundler.bundle()
    .on('error', (err) => { console.error(err); })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpif(isEnvProduction, uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(jsPaths.dest));
});

gulp.task('vendors', () => gulp.src(vendorSrc)
  .pipe(sourcemaps.init())
  .pipe(concat('vendors.js'))
  .pipe(gulpif(isEnvProduction, uglify()))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(jsPaths.dest)));

gulp.task('copy:public', () => gulp.src(filesToCopy.public)
  .pipe(gulp.dest(`${dirs.dest}/public`)));

gulp.task('copy:views', () => gulp.src(filesToCopy.views)
  .pipe(gulp.dest(`${dirs.dest}/views`)));

gulp.task('copy', ['copy:public', 'copy:views']);

gulp.task('bundle-sw', () => wbBuild.generateSW({
  globDirectory: './dist/public/',
  swDest: './dist/public/sw.js',
  globPatterns: ['**/*.{html,js,css,eot,svg,ttf,woff,woff2}'],
})
  .then(() => {
    console.log('Service worker generated.');
  })
  .catch((err) => {
    console.log(`[ERROR] This happened: ${err}`);
  }));

gulp.task('fonts:fontAwesome', () => gulp.src(fontsPaths.fontAwesome.src)
  .pipe(gulp.dest(fontsPaths.fontAwesome.dest)));

gulp.task('fonts:bootstrap', () => gulp.src(fontsPaths.bootstrap.src)
  .pipe(gulp.dest(fontsPaths.bootstrap.dest)));

gulp.task('fonts', ['fonts:fontAwesome', 'fonts:bootstrap']);

gulp.task('server', () => {
  const server = gls.new(`./${dirs.dest}/app.js`);

  server.start();
  gulp.watch(`${dirs.src}/**/*.ts`, ['ts:backend']);
  gulp.watch(`${dirs.src}/public/sass/**/*.scss`, ['styles', 'bundle-sw']);
  gulp.watch(`${dirs.src}/public/js/**/*.js`, ['js', 'bundle-sw']);
});

gulp.task('build', () => runSequence(
  'clean', 
  'ts:backend',
  ['images', 'styles', 'js', 'vendors', 'fonts', 'copy'],
  'bundle-sw'
));