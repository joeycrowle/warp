var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
  ];

//browsersync
gulp.task('sync', function(gulpCallback){
  browserSync.init({
    server: false,
    proxy: "pixiwarp.beta",
    injectChanges: true,
    stream: true
  }),
  gulp.watch(['*.php', '*.html'], browserSync.reload);
  gulp.watch('css/*', ['sass']);
  gulp.watch('js/*', ['script']);
});

//tasks
gulp.task('sass', function(){
  gulp.src(['css/style.scss'])
  .pipe(sass())
  .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
  .pipe(minify())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.stream());
});

gulp.task('script', function(){
  gulp.src('js/main.js')
  .pipe(uglify())
  .pipe(rename('script.min.js'))
  .pipe(gulp.dest('dist/js'))
  .pipe(browserSync.stream());
});
