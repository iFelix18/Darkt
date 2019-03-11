'use strict'

let autoprefixer = require('gulp-autoprefixer')
let beautify = require('gulp-beautify')
let gulp = require('gulp')
let insert = require('gulp-file-insert')
let rename = require('gulp-rename')
let sass = require('gulp-sass')

sass.compiler = require('node-sass')

gulp.task('autoprefix', function () {
  return gulp.src('./css/theme.css')
    .pipe(autoprefixer({
      browsers: [
        '> 0.2%',
        'last 2 versions'
      ],
      cascade: false
    }))
    .pipe(gulp.dest('./css'))
})

gulp.task('usercss', function () {
  return gulp.src('./css/theme.user.css')
    .pipe(insert({
      '/* theme */': './css/theme.css'
    }))
    .pipe(rename('darkt.user.css'))
    .pipe(beautify.css({
      end_with_newline: true,
      indent_size: 2,
      preserve_newlines: false
    }))
    .pipe(gulp.dest('./'))
})

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css'))
})

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', gulp.series('sass', 'autoprefix', 'usercss'))
})

gulp.task('default', gulp.series('sass:watch'))
