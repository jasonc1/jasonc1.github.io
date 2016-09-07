// grab our gulp packages
var gulp  = require('gulp'),
    jshint = require('gulp-jshint'),


gulp.task('default', ['watch']);

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('app/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('source/javascript/**/*.js', ['jshint']);
});

gulp.task('copyHtml', function() {
  // copy any html files in source/ to public/
  gulp.src('app/*.html').pipe(gulp.dest('dist'));
  gulp.src('app/projects/*html').pipe(gulp.dest('dist/projects'))
});


gulp.watch('source/javascript/**/*.js', ['jshint']);
