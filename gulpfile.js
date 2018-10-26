var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var rename = require('gulp-rename');
var concat = require('gulp-concat');





// define the default task and add the watch task to it
gulp.task('default', ['html', 'js', 'minify-css', 'fonts', 'images', 'misc', 'projects']);



gulp.task('html', function(){
  return gulp.src('app/*.html')
  .pipe(gulp.dest('dist/'))
});


gulp.task('js', function() {
  return gulp.src('app/js/*.js')
  .pipe(concat('script.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
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


// gulp.task('pdf', function(){
//   return gulp.src('app/projects/*.pdf')
//   .pipe(gulp.dest('dist/projects'))
// })

gulp.task('misc', function(){
  return gulp.src('app/misc/jason_chen_resume_2018.*')
  .pipe(gulp.dest('dist/misc'))
})

gulp.task('projects', function() {
  return gulp.src('app/projects/*.html')
  .pipe(gulp.dest('dist/projects'))
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})