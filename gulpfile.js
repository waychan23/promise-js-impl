const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const uglify = require('gulp-uglify');
const minify = require('gulp-minify');
const gutil = require('gulp-util');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

//browserify instance
const bOpts = {
    'entries': ['./src/promise.js'],
    'debug': true,
    'plugin': [watchify]
};
const bi = browserify(bOpts);

bi.on('update', bundle);
bi.on('log', gutil.log);

function bundle(){
    return bi.bundle()
	.on('error', (err) => { gutil.log(err); })
	.pipe(source('bundle.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write('./'))
	.pipe(minify())
	.pipe(gulp.dest('build/browser'));
}

gulp.task('clean', function(){
    return del(['build']);
});

gulp.task('build-for-browser', ['clean'], function(){
    return bundle();
});

gulp.task('build-for-node', ['clean'], function(){
    return gulp.src('src/**/*.js')
//	.pipe(minify())
	.pipe(gulp.dest('build/node'));
});

gulp.task('default', ['build-for-browser', 'build-for-node']);
