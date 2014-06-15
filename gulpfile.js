var gulp = require('gulp')
  , livereload = require('gulp-livereload')
  , serve = require('gulp-serve')
  , sass = require('gulp-sass');

gulp.task('watch', ['sass-dev'], function () {
  livereload.listen();
  gulp.watch('src/app/*.scss', ['sass-dev']);
  gulp.watch('src/app/*.html').on('change', livereload.changed);

});

gulp.task('serve', ['watch'], function (args) {
  serve({ root: ['src/app', 'bower_components', 'src/vendor'], port: 8118 })(args);
});


gulp.task('sass-dev', function () {
  gulp.src([
    'bower_components/compass-mixins/lib/_compass.scss',
    // 'bower_components/foundation/scss/foundation.scss',
    'src/app/*.scss'
  ])
    .pipe(sass())
    .pipe(gulp.dest('src/app'))
    .pipe(livereload());
});