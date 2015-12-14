var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul');


gulp.task('coverage', function () {
    gulp.src(['lib/index.js'])
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire())
        .pipe(gulp.dest('coverage'));
});

gulp.task('test', ['coverage'], function () {
    gulp.src('test/**/*.js')
        .pipe(mocha())
        .on('error', function (err) {
            console.log(err);
        })
        .pipe(istanbul.writeReports());
});

gulp.task('debug_test', function () {
    gulp.src('test/**/*.js')
        .pipe(mocha())
        .on('error', function (err) {
            console.log(err);
        });
});

gulp.task('develop', function () {
    gulp.watch('**/*.js', ['debug_test']);
});
