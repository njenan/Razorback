var gulp = require('gulp'),
    mocha = require('gulp-mocha');


gulp.task('test', function () {
    gulp.src('test/**/*.js')
        .pipe(mocha())
        .on('error', function (err) {
            console.log(err);
        });
});

gulp.task('develop', function () {
    gulp.watch('**/*.js', ['test']);
});
