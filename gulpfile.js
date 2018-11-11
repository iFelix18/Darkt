//============================================================================//
var chalk = require("chalk");
var gulp = require("gulp");
var autoprefixer = require("gulp-autoprefixer");
var bump = require("gulp-bump");
var concatCss = require("gulp-concat-css");
var sass = require("gulp-sass");
var sassLint = require("gulp-sass-lint");
var replace = require("gulp-string-replace");
var runSequence = require("run-sequence");
var timestamp = require("time-stamp");

sass.compiler = require("node-sass");

const log = console.log;
const time = "[HH:mm:ss]";
const end = chalk.green.bold.inverse;
const error = chalk.red.bold.inverse(timestamp(time) + " Something went wrong!")
//============================================================================//

//============================================================================//
// CSS
// style the scss files
gulp.task("style", () =>
    gulp.src("./sass/**/*.scss")
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(autoprefixer({
            browsers: [
                "> 0.2%",
                "last 2 versions"
        ],
            cascade: false
        }))
        .pipe(gulp.dest("./sass"))
        .on("end", () =>
            log(end(timestamp(time) + " SCSS styled!"))
        )
        .on("error", () =>
            log(error)
        )
);
// compile the scss files
gulp.task("compile", () =>
    gulp.src("./sass/**/*.scss")
        .pipe(sass({
            outputStyle: "expanded",
            indentType: "space",
            indentWidth: 4
        }))
        .pipe(gulp.dest("./css"))
        .on("end", () =>
            log(end(timestamp(time) + " SCSS compiled!"))
        )
        .on("error", () =>
            log(error)
        )
);
// create the css file
gulp.task("CSS", (done) =>
    runSequence(
        "style",
        "compile",
        done
    )
);
// watch the scss files and create the css file
gulp.task("sass:watch", () =>
    gulp.watch("./sass/**/*.scss", ["CSS"])
);
//============================================================================//

//============================================================================//
// build the usercss file
gulp.task("build", () =>
    gulp.src(["./css/theme.user.css", "./css/theme.css"])
        .pipe(concatCss("darkt.user.css"))
        .pipe(gulp.dest("./"))
        .on("end", () =>
            log(end(timestamp(time) + " USERCSS builded!"))
        )
        .on("error", () =>
            log(error)
        )
);
// create the css file
gulp.task("USERCSS", (done) =>
    runSequence(
        "build",
        done
    )
);
// watch the css files and create the usercss file
gulp.task("css:watch", () =>
    gulp.watch("./css/**/*.css", ["USERCSS"])
);
//============================================================================//

//============================================================================//
// BUMP VERSION
// Semantic Versioning (major|minor|patch)
var semver = function(options) {
    gulp.src(["./package.json", "./css/theme.user.css", "./sass/**/_version.scss"])
        .pipe(bump(options))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
};
// bump to a major update (1.0.0)
gulp.task("bump:major", () =>
    semver({
        type: "major"
    })
);
// bump to a minor update (0.1.0)
gulp.task("bump:minor", () =>
    semver({
        type: "minor"
    })
);
// bump to a patched update (0.0.2)
gulp.task("bump:patch", () =>
    semver({
        type: "patch"
    })
);
// bump to a prerelease update (0.0.1-2)
gulp.task("bump:prerelease", () =>
    semver({
        type: "prerelease"
    })
);
//============================================================================//

//============================================================================//
// DEFAULT TASK
gulp.task("default", (done) =>
    runSequence(
        "CSS",
        "sass:watch",
        "USERCSS",
        "css:watch",
        done
    )
);
//============================================================================//
