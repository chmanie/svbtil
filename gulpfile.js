var gulp = require('gulp')
  , livereload = require('gulp-livereload')
  , serve = require('gulp-serve')
  , sass = require('gulp-sass')
  , minifyCss = require('gulp-minify-css')
  , uglify = require('gulp-uglify')
  , replace = require('gulp-replace');

gulp.task('watch', ['sass-dev'], function () {
  livereload.listen(35739);
  gulp.watch('src/app/*.scss', ['sass-dev']);
  gulp.watch('src/app/*.html').on('change', livereload.changed);

});

gulp.task('serve', ['watch'], function (args) {
  serve({ root: ['src/app', 'bower_components', 'src/vendor'], port: 8118 })(args);
});

gulp.task('build', ['index-build', 'js-build', 'sass-build']);


gulp.task('sass-dev', function () {
  gulp.src([
    'bower_components/compass-mixins/lib/_compass.scss',
    // 'bower_components/foundation/scss/foundation.scss',
    'src/app/*.scss'
  ])
    .pipe(sass())
    .pipe(gulp.dest('src/app'))
    .pipe(livereload(35739));
});

gulp.task('sass-build', function () {
  gulp.src([
    'bower_components/compass-mixins/lib/_compass.scss',
    // 'bower_components/foundation/scss/foundation.scss',
    'src/app/*.scss'
  ])
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(gulp.dest('build'));
});

gulp.task('js-build', function () {
  gulp.src([
    'src/app/*.js'
  ])
    .pipe(replace('http://localhost:9000', 'http://beta.api.dowser.de'))
    .pipe(uglify())
    .pipe(gulp.dest('build'));
});

gulp.task('index-build', function () {
  gulp.src([
    'src/app/index.html'
  ])
    .pipe(replace(/(<\!\-\-\slivereload\s\-\->.*<\!\-\-\s\/livereload\s\-\->)/g, ''))
    .pipe(gulp.dest('build'));
});