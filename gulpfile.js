var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('hello', function() {
	console.log('Hello Simon');
});

gulp.task('sass', function() {
	return gulp.src('source-files')
	.pipe(sass()) // Using gulp-sass
	.pipe(gulp.dest('destination'))
});

// gulp.task('sass', function() {
// 	return gulp.src('app/scss/styles.scss')
// 	.pipe(sass()) // Converts sass to CSS with gulp sass
// 	.pipe(gulp.dest('app/css'))
// });

gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
	.pipe(sass())
	.pipe(gulp.dest('app/css'))
});

//Gulp watch syntax
gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch('app/scss/**/*.scss', ['sass']);
	//Reloads the browser whenever HTML or JS files change
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

//Browser sync
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
	});
});

gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
	.pipe(sass())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

//Minification and concatenation
gulp.task('useref', function() {
	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulp.dest('dist'))
});

gulp.task('useref', function() {
	return gulp.src('app/*.html')
		.pipe(useref())
		// Minifies only if it's a Javascript file
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulp.dest('dist'))
});	

gulp.task('useref', function() {
	return gulp.src('app/*.html')
	.pipe(useref())
	.pipe(gulpIf('*.js', uglify()))
	// Minifies only if it's a CSS file
	.pipe(gulpIf('*.css', cssnano()))
	.pipe(gulp.dest('dist'))
});

//Optimise images
gulp.task('images', function() {
	return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
	.pipe(imagemin({
		//Setting interlaced to true
		interlaced: true
	}))
	.pipe(gulp.dest('dist/images'))
});

gulp.task('images', function() {
	return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
	// Caching images that ran through imagemin
	.pipe(cache(imagemin({
		interlaced: true
	})))
	.pipe(gulp.dest('dist/images'))
});

//Copying font file to dist
gulp.task('fonts', function() {
	return gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
});

//Delete tasks
gulp.task('clean:dist', function() {
	return del.sync('dist');
});

//Cache clear
gulp.task('cache:clear', function(callback) {
	return cache.clearAll(callback)
});

//Run sequence
gulp.task('task-name', function(callback) {
	runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback);
});

gulp.task('default', function(callback) {
	runSequence(['sass', 'browserSync', 'watch'],
		callback
		)
});

// gulp.task('task-name', function() {
// 	return gulp.src('source-files') // Get source files with gulp.src
// 	.pipe(aGulpPlugin()) // Sends it through a gulp plugin
// 	.pipe(gulp.dest('destination')) // Outputs the file in the destination folder
// })