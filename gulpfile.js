var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

gulp.task('build', ['sass', 'compressJs', 'compressCss', 'movePlugins', 'moveIndex', 'moveTemplates'], function(){});

gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch('sass/**/*.scss', ['sass']);
	gulp.watch('./**/*.html', browserSync.reload);
	gulp.watch('./**/*.js', browserSync.reload);
});

gulp.task('sass', function() {
	return gulp.src('sass/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('css/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: './'
		},

		port: 8080,
	})
});

gulp.task('compressJs', function(){
    return gulp.src(['js/eventConfig.js', 'js/eventControllers.js'])
        .pipe(concat('event.min.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('compressCss', function(){
    gulp.src('css/main.css')
        .pipe(minifyCSS())
        .pipe(rename('main.min.css'))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('movePlugins', function() {
	gulp.src(['plugins/**/*']).pipe(gulp.dest('dist/plugins'));
});

gulp.task('moveIndex', function() {
	gulp.src(['index.html']).pipe(gulp.dest('dist/'));
});

gulp.task('moveTemplates', function() {
	gulp.src(['templates/**/*']).pipe(gulp.dest('dist/templates'));
});