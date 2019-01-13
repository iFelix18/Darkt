"use strict";
//============================================================================//
var chalk = require("chalk");
var gulp = require("gulp");
var autoprefixer = require("gulp-autoprefixer");
var beautifyCode = require("gulp-beautify-code");
var bump = require("gulp-bump");
var gfi = require("gulp-file-insert");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var sassLint = require("gulp-sass-lint");
var timestamp = require("time-stamp");

sass.compiler = require("node-sass");

var log = console.log;
var time = "[HH:mm:ss]";
var end = chalk.green.bold.inverse;
var error = chalk.red.bold.inverse(timestamp(time) + " Something went wrong!")
//============================================================================//
//================================BUMP VERSION================================//
// bump to a major update (1.0.0)
gulp.task("bump:major", () =>
    gulp.src(["./package.json", "./css/theme.user.css", "./sass/**/_version.scss"])
    .pipe(bump({
        type: "major"
    }))
    .pipe(gulp.dest(function (file) {
        return file.base;
    }))
);
// bump to a minor update (0.1.0)
gulp.task("bump:minor", () =>
    gulp.src(["./package.json", "./css/theme.user.css", "./sass/**/_version.scss"])
    .pipe(bump({
        type: "minor"
    }))
    .pipe(gulp.dest(function (file) {
        return file.base;
    }))
);
// bump to a patched update (0.0.2)
gulp.task("bump:patch", () =>
    gulp.src(["./package.json", "./css/theme.user.css", "./sass/**/_version.scss"])
    .pipe(bump({
        type: "patch"
    }))
    .pipe(gulp.dest(function (file) {
        return file.base;
    }))
);
// bump to a prerelease update (0.0.1-2)
gulp.task("bump:prerelease", () =>
    gulp.src(["./package.json", "./css/theme.user.css", "./sass/**/_version.scss"])
    .pipe(bump({
        type: "prerelease"
    }))
    .pipe(gulp.dest(function (file) {
        return file.base;
    }))
);
//============================================================================//
//====================================CSS=====================================//
gulp.task("compile", () =>
    gulp.src("./sass/**/*.scss")
    .pipe(beautifyCode({
        newline_between_rules: true
    }))
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass({
        outputStyle: "expanded",
        indentType: "space",
        indentWidth: 4
    }))
    .pipe(gulp.dest("./css"))
    .on("end", () =>
        log(end(timestamp(time) + " Compiled!"))
    )
    .on("error", () =>
        log(error)
    )
);
gulp.task("autoprefix", () =>
    gulp.src("./css/theme.css")
    .pipe(autoprefixer({
        browsers: [
            "> 0.2%",
            "last 2 versions"
        ],
        cascade: false
    }))
    .pipe(gulp.dest("./css"))
    .on("end", () =>
        log(end(timestamp(time) + " Autoprefixed!"))
    )
    .on("error", () =>
        log(error)
    )
);
//============================================================================//
//==================================USERCSS===================================//
gulp.task("build", () =>
    gulp.src("./css/theme.user.css")
    .pipe(gfi({
        "/* theme */": "./css/theme.css"
    }))
    .pipe(beautifyCode({
        newline_between_rules: true
    }))
    .pipe(rename("darkt.user.css"))
    .pipe(gulp.dest("./"))
    .on("end", () =>
        log(end(timestamp(time) + " Builded!"))
    )
    .on("error", () =>
        log(error)
    )
)
//============================================================================//
gulp.task("sass:watch", () =>
    gulp.watch("./sass/**/*.scss", gulp.series("compile", "autoprefix", "build"))
);
//============================================================================//
gulp.task("watch", gulp.parallel("sass:watch"));
gulp.task("default", gulp.series("compile", "autoprefix", "build", "watch"));
//============================================================================//
