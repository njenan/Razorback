var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul');


gulp.task('coverage', function () {
    gulp.src('index.js')
        .pipe(istanbul())
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

gulp.task('develop', function () {
    gulp.watch('**/*.js', ['test']);
});
