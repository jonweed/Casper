var gulp = require('gulp');

// gulp plugins and utils
var log = require('fancy-log');
var livereload = require('gulp-livereload');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');

// postcss plugins
var autoprefixer = require('autoprefixer');
var colorFunction = require('postcss-color-function');
var cssnano = require('cssnano');
var customProperties = require('postcss-custom-properties');
var easyimport = require('postcss-easy-import');
var sass = require('gulp-sass');

var swallowError = function swallowError(error) {
    log(error.toString());
    beeper();
    this.emit('end');
};

gulp.task('css', gulp.series(function(done) {
    var processors = [
        easyimport,
        customProperties,
        colorFunction(),
        autoprefixer({browsers: ['last 2 versions']}),
        cssnano()
    ];

    gulp.src('assets/css/*.css')
        .on('error', swallowError)
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/built/'))
        .pipe(livereload());

    done();
}));

gulp.task('build', gulp.series('css', function (done) {
    livereload.listen(1234);
    done();
}));

gulp.task('sass', function (done) {
  gulp.src('assets/css/*.scss')
    .pipe(sass.sync().on('error', swallowError))
    .pipe(gulp.dest('assets/built/'));
    done();
});

gulp.task('watch', function (done) {
    gulp.watch('assets/css/*.scss')
    .on('change', function(path,stats) {

        gulp.src('assets/css/*.scss')
          .pipe(sass.sync().on('error', swallowError))
          .pipe(gulp.dest('assets/built/'));
          });

    gulp.watch('assets/css/*.css')
    .on('change', function(path,stats) {
        var processors = [
            easyimport,
            customProperties,
            colorFunction(),
            autoprefixer({browsers: ['last 2 versions']}),
            cssnano()
        ];

        gulp.src('assets/css/*.css')
            .on('error', swallowError)
            .pipe(sourcemaps.init())
            .pipe(postcss(processors))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('assets/built/'))
            .pipe(livereload());

    });

    done();
});

gulp.task('default', gulp.series('build', 'watch'));
