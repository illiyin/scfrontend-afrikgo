// Defining requirements
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var gulpSequence = require('gulp-sequence');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

/* ================= WATCHER ================== */
gulp.task('watch', function () {
    gulp.watch('./dist/sass/**/*.scss', gulp.parallel(['process-css']));
});

/* ================= COMPILER ================== */
gulp.task('pack-css', function () {
    return gulp.src([
        // example
        'node_modules/bootstrap/dist/css/bootstrap.min.css'
    ])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('pack-js', function () {
    return gulp.src([
        // example
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('assets/js'));
});

gulp.task('compile-sass', function () {
    var stream = gulp.src('dist/sass/main.scss')
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
    .pipe(rename('style.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('src/css'));
    return stream;
});

gulp.task('minify-css', function() {
    return gulp.src([
        './src/css/*.css',
    	'!./src/css/*.min.css'
    ])
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('src/css'));
});

gulp.task('minify-js', function() {
    return gulp.src([
        './dist/js/*.js',
    	'!./dist/js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('src/js'));
});

gulp.task('process-css', gulp.series('pack-css', 'compile-sass', 'minify-css'));
gulp.task('process-js', gulp.series('pack-js', 'minify-js'));
gulp.task('compile', gulp.series('process-css', 'process-js'));
