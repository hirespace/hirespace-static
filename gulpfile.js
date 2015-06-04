var autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    express = require('express'),
    gulp = require('gulp'),
    karma = require('karma'),
    minifycss = require('gulp-minify-css'),
    mocha = require('gulp-mocha'),
    nodemon = require('gulp-nodemon'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    typescript = require('gulp-tsc');

gulp.task('server', function () {
    nodemon({
        script: 'app/Boot.js',
        ext: 'ts html',
        ignore: ['js/**/*', 'README'],
        env: {NODE_ENV: 'development'},
        tasks: ['typescript-server', 'test-server']
    }).on('restart', function () {
        console.log('Server restarted!');
    });
});

gulp.task('typescript-server', function () {
    compileTsc('app', true);
});

gulp.task('test-server', function () {
    return gulp.src('app/**/*.spec.js', {read: false})
        .pipe(mocha({reporter: 'list'}));
});

gulp.task('concatVendor', function () {
    gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/knockout/dist/knockout.js',
        'bower_components/lodash/lodash.min.js',
        'bower_components/rxjs/dist/rx.all.min.js'
    ])
        .pipe(plumber({errorHandler: onError}))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('js/dist'))
        .pipe(notify('Vendor compiled'));
});

gulp.task('typescript', function () {
    compileTsc('js', false);
});

gulp.task('test', function (done) {
    karma.server.start({
        configFile: process.cwd() + '/js/test/karma.conf.js'
    }, done);
});

gulp.task('sass', function () {
    compileSass('website', 'css/src')
});

gulp.task('default', function () {
    gulp.watch('css/src/**/*.sass', ['sass']);
    gulp.watch('js/**/*.ts', ['typescript']);
    gulp.watch('js/test/*.js', ['test']);

    gulp.start('server');
});

function compileTsc(path, isServer) {
    var src = gulp.src([
        path + '/**/*.ts',

        // Ignore specs, dist, and typings
        '!' + path + '/**/*.specs.ts',
        '!' + path + '/dist/**/*',
        '!' + path + '/typings/**/*'
    ], {base: path})
        .pipe(plumber({errorHandler: onError}))
        .pipe(typescript({
            target: 'ES5',
            sortOutput: true,
            sourceMap: false,
            removeComments: true
        }));

    var dest;

    if (isServer == false) {
        dest = src
            .pipe(concat('app.js'));
    } else {
        dest = src;
    }

    dest
        .pipe(isServer ? gulp.dest(path) : gulp.dest(path + '/dist'))
        .pipe(notify('Typescript compiled'));

    compileTscTests(path, isServer);
}

function compileTscTests(path, isServer) {
    var src = gulp.src([
        path + '/**/*.ts',

        // Ignore dist and typings
        '!' + path + '/dist/**/*',
        '!' + path + '/typings/**/*'
    ], {base: path})
        .pipe(plumber({errorHandler: onError}))
        .pipe(typescript({
            target: 'ES5',
            sortOutput: true,
            sourceMap: false,
            removeComments: true
        }));

    var dest;

    if (isServer == false) {
        dest = src
            .pipe(concat('all.js'));
    } else {
        dest = src;
    }

    dest
        .pipe(isServer ? gulp.dest(path) : gulp.dest(path + '/test'))
        .pipe(notify('Tests compiled'))
}

function compileSass(name, pathToSass) {
    gulp.src(pathToSass + '/' + name + '.sass')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass({
            loadPath: process.cwd() + pathToSass,
            style: 'nested',
            indentedSyntax: true,
            includePaths: pathToSass
        }))
        .pipe(autoprefixer({
            browsers: ['last 20 versions', '> 2%'],
            cascade: false
        }))
        .pipe(gulp.dest('css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('css'))
        .pipe(notify(name + ' successfully compiled!'));
}

function onError(err) {
    notify.onError({
        title: 'Gulp',
        subtitle: 'Failure!',
        message: 'Error: <%= error.message %>'
    })(err);

    this.emit('end');
}