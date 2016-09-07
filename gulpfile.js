var gulp   = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var ghPages = require('gulp-gh-pages');





// define the default task and add the watch task to it
gulp.task('default', ['html', 'projects', 'minify-css', 'fonts', 'images', 'pdf']);



gulp.task('html', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
});


gulp.task('projects', function(){
  return gulp.src('app/projects/*.html')
  .pipe(useref())
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulp.dest('dist/projects'))
})

gulp.task('minify-css', function() {
  return gulp.src('app/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/img'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})


gulp.task('pdf', function(){
  return gulp.src('app/projects/*.pdf')
  .pipe(gulp.dest('dist/projects'))
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})