// require modules
const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render')
const data = require('gulp-data');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const surge = require('gulp-surge');
const rsync = require('rsyncwrapper');
const Server = require('karma').Server;
const spritesmith = require('gulp.spritesmith');
const psi = require('psi');
const runSequence = require('run-sequence');
const responsiveGm = require('gulp-responsive-images');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const fs = require('fs')


// require config
const config = require('./config.js');

// require creds
const creds =  require('/Users/samatkins/projects/info/secrets.json');


/* ==========================================================================
    dev / build
========================================================================== */


// combined dev task
gulp.task('default', function(callback) {
    runSequence(
        'clean:dev',

        // toggle: lint ON
        // ['sprites', 'lint:js', 'lint:scss'],
        
        // toggle: lint OFF
        ['sprites'],

        ['sass', 'nunjucks', 'images'],
        ['browserSync', 'watch'],
        callback
        );
});


// combined build task - updated files go to /dist
gulp.task('build', function(callback) {
    runSequence(
        ['clean:dev', 'clean:dist'],
        ['sprites', 'lint:js'],
        ['sass', 'nunjucks'],
        ['useref', 'build-images', 'fonts'],

        // add in if JS tests to run
        // ['useref', 'build-images', 'fonts', 'test'],
        
        callback
        );
})


/* ==========================================================================
    Render html and styles
========================================================================== */


// nunjucks to render html
gulp.task('nunjucks', function() {
 // gets .html and .njk files in pages
 return gulp.src('app/templates/pages/**/*.+(html|njk)')
 .pipe(customPlumber('Error Running Nunjucks'))
 // adding data to Nunjucks parsed to JSON so watchable
 .pipe(data(function() {
    return JSON.parse(fs.readFileSync('./app/templates/njk_data.json'))
 }))
 // renders nunjuck files
 .pipe(nunjucksRender({
     path: ['app/templates/']
     }))
 // output files in app folder
 .pipe(gulp.dest('app/'))
 .pipe(browserSync.reload({
    stream: true
 }));
});


// sass to css
gulp.task('sass', function() {
    return gulp.src(config.sass.src)
    // checks for errors in all plugins
    .pipe(customPlumber('Error running Sass'))
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', errorHandler))
    .pipe($.autoprefixer())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(config.sass.dest))
    .pipe(browserSync.reload({
        stream: true
    }));
});


// useref for cache busting
gulp.task('useref', function() {    
    return gulp.src(config.useref.src)
        .pipe($.useref())
        .pipe($.cached('useref'))
        .pipe($.debug())
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano()))
        .pipe($.if('*.js', $.rev()))
        .pipe($.if('*.css', $.rev()))
        .pipe($.revReplace())
        .pipe(gulp.dest(config.useref.dest))
});


/* ==========================================================================
    browser sync, watchers and cleaners 
========================================================================== */


// Browser Sync
gulp.task('browserSync', function() {
    browserSync ({
        server: {
            baseDir: 'app'
        },
        browser: 'google chrome canary',
        notify: false
    })
})


// file watchers
gulp.task('watch', function() {
    gulp.watch([
        'app/templates/**/*',
        'app/pages/**/*.+(html|njk)',
        'app/data.json'
        ], ['nunjucks'])
    gulp.watch(config.sass.src, ['sass']);
    gulp.watch(config.js.src, ['watch-js']);
    gulp.watch(config.html.src, browserSync.reload);
});

gulp.task('watch-js', ['lint:js'], browserSync.reload);


// clean dev
gulp.task('clean:dev', function() {
    return del.sync([
        'app/css/'
        ]);
});


// cleans dist with gulp-cache
gulp.task('clean:dist', function() {
    return del.sync(['dist']);
})


// cleans responsive folder
gulp.task('clean:responsive', function() {
    return del.sync([
        '/app/responsive/**/*'
    ]);
})


// clears cache for imagemin 
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
})


/* ==========================================================================
    deploy
========================================================================== */


// run dist in local server
gulp.task('serve:dist', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        browser: 'google chrome',
        notify: false       
    })
})


// rsync deploy to server 
gulp.task('rsync', function() {
    rsync({
        src: 'dist/',
        // amend dest path 
        dest: creds.samat.dest,
        ssh: true,
        recursive: true,
        deleteAll: true
    }, function(error, stdout, stderr, cmd) {
        if (error) {
            console.log(error.message);
            console.log(stdout);
            console.log(stderr);
        }
    });
})


// deploy to surge.sh, change url in config 
gulp.task('surge', [], function () {
  return surge({
        project:    config.surge.project,
        domain: config.surge.domain
  })
})


/* ==========================================================================
    images and sprites
========================================================================== */


// use GM then move to folder responsive
gulp.task('imagesgm', function() {
    return gulp.src('app/images_src/**/*')
        .pipe(responsiveGm({
            '*.+(jpg|jpeg|png)': [{
                width: 1600,
                suffix: '_1600_large_2x',
                quality: 75
            }, {
                width: 800,
                suffix: '_800_large_1x',
                quality: 70
            }, {
                width: 600,
                suffix: '_medium',
                quality: 60
            }, {
                width: 500,
                height: 375,
                crop: 'center',
                suffix: '_small',
                quality: 50
            }],
        }))
        .pipe(gulp.dest('app/responsive/'));
});


// use imagemin then move to folder images 
gulp.task('imagesmin', function() {
    return gulp.src('app/responsive/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('app/images/'));
});


// copies any images in fixed to images folder 
gulp.task('copy-fixed-images', function() {
    return gulp.src('./app/images_src/fixed/**/*')
        .pipe(gulp.dest('./app/images/'));
});


// cleans responsive folder
gulp.task('clean:responsive', function() {
    return del([
        './app/responsive/**/*'
    ]);
})


// clears cache for imagemin 
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
})


// combo dev task for responsive (gm) and min images
gulp.task('images', function(callback) {
    runSequence('imagesgm', ['imagesmin', 'copy-fixed-images'],
        'clean:responsive',
        callback);
});


// 'build' task i.e. moves app/images to dist/images
gulp.task('build-images', function() {
    return gulp.src('./app/images/**/*')
        .pipe(gulp.dest('./dist/images/'));
});


// amend src folder within file structure
gulp.task('sprites', function() {
    gulp.src(config.sprites.src)
        .pipe(spritesmith(config.sprites.options))
        .pipe($.if('*.png', gulp.dest(config.sprites.imgDest)))
        .pipe($.if('*.scss', gulp.dest(config.sprites.scssDest)));
});


/* ==========================================================================
    error handling (plumber)
========================================================================== */


function errorHandler(err) {
    // Logs the error in the command line
    console.log(err.toString());
    // Ends the current pipe so Gulp Watch doesn't break
    this.emit('end');
}


// notifies on errors using custom messages
function customPlumber(errTitle) {
    return plumber({
        errorHandler: notify.onError({
            title: errTitle || "Error running Gulp",
            message: "Error: <%= error.message %>",
            sound: "Basso"
            })
    });
}

// // TODO: is this required?
// module.exports = customPlumber;


/* ==========================================================================
    linters
========================================================================== */


// SCSS linting 
gulp.task('lint:scss', function() {
    return gulp.src(config.sass.src)
    .pipe($.scssLint(config.scssLint));
});


// JS linting 
gulp.task('lint:js', function() {
    return gulp.src(config.js.src)
    .pipe(customPlumber('JSHint Error'))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    // .pipe($.jshint.reporter ('fail', config.jshint.reporterOptions))
    .pipe($.jshint.reporter ('fail'))
    // .pipe($.jscs(config.jscs.options))
    // .pipe(gulp.dest(config.jscs.dest))
});

// combined linter
gulp.task('lint', function(callback) {
    runSequence(
        ['lint:js', 'lint:scss'],
        callback
        );
});


/* ==========================================================================
    fonts
========================================================================== */


// Copying fonts
gulp.task('fonts', function() {
    return gulp.src(config.fonts.src)
        .pipe(gulp.dest(config.fonts.dest))
});


/* ==========================================================================
    testing 
========================================================================== */


// run test once and exit
gulp.task('test', function(done) {
    new Server({
        configFile: process.cwd() + '/karma.conf.js',
        singleRun: true
    }, done).start();
});


// watch for file changes & re-run tests
gulp.task('tdd', function (done) {
  new Server({
    configFile: process.cwd() + '/karma.conf.js'
  }, done).start();
});

// notes
// 
// process.cwd()
// returns current working directory
// i.e. directory from which node / gulp command invoked
// 
// __dirname 
// returns the directory name containing JS source code file


/* ==========================================================================
    page speed insights (psi)
========================================================================== */


gulp.task('mobile', function () {
    return psi(config.psi.site, {
        // key: key
        nokey: 'true',
        strategy: 'mobile',
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
        console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
    });
});


gulp.task('desktop', function () {
    return psi(config.psi.site, {
        nokey: 'true',
        // key: key,
        strategy: 'desktop',
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
    });
});
