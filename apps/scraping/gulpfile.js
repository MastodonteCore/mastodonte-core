const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const del = require('del');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const runSequence = require('run-sequence');

const isEnvProduction = process.NODE_ENV === 'production';

const dirs = {
  src: 'public/src',
  dest: 'public/dist'
}

const jsPaths = {
  src: `${dirs.src}/js/main.js`,
  dest: `${dirs.dest}/js/`
}

const cleanFolders = [
  'public/dist'
]

gulp.task('clean', () => {
  return del(cleanFolders)
})

gulp.task('js', () => {
  const bundler = browserify({
    entries: jsPaths.src,
    debug: true
  })
  bundler.transform(babelify);

  return bundler.bundle()
    .on('error', function (err) { console.error(err) })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpif(isEnvProduction, uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(jsPaths.dest))
})

gulp.task('build', () => {
  return runSequence(
    'clean',
    ['js']
  )
});