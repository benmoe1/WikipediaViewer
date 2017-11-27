/* eslint-disable */
const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
var htmlreplace = require('gulp-html-replace');

gulp.task('minify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(rename('index.html'))
    .pipe(htmlreplace({
      'css': 'css/style.min.css',
      'js': 'js/app.min.js'
    }))
    .pipe(gulp.dest('dist'));
});
gulp.task('uglify', function () {
  return gulp.src('src/js/app.js')
      .pipe(uglify())
      .pipe(rename('app.min.js'))
      .pipe(gulp.dest('dist/js/'));
});
gulp.task('minify-css', function() {
  return gulp.src('src/css/style.css')
    .pipe(cleanCSS())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('dist/css/'));
});