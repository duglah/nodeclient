var gulp = require('gulp');
var concat = require('gulp-concat');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var tsconfig = require("./tsconfig.json");

gulp.task('default', ['compile-debug']);
gulp.task('release', ['compile-release']);

gulp.task('compile-debug', function() {
    return gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(ts(tsconfig.compilerOptions))
        .pipe(sourcemaps.write('.', {
            sourceRoot: function(file) { return file.cwd + '/src'; }
        }))
        .pipe(gulp.dest("dist"));
});

gulp.task('compile-release', function() {
    return gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(ts(tsconfig.compilerOptions))
        .pipe(concat("app.js"))
        .pipe(sourcemaps.write('.', {
            sourceRoot: function(file) { return file.cwd + '/src'; }
        }))
        .pipe(gulp.dest("dist"));
});
gulp.task('watch', function() {
    gulp.watch(["src/**/*.ts"], ['compile-debug']);
});

gulp.task('clean', function() {
    return del(["dist"]);
});