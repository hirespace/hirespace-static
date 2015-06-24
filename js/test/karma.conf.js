module.exports = function (config) {
    config.set({
        basePath: '.',
        frameworks: ['jasmine'],
        files: [
            '../dist/vendor.js',
            'all.js'
        ],
        exclude: [],
        port: 6066,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        colors: true,
        browsers: ['PhantomJS'],
        singleRun: true,
        reportSlowerThan: 500,
        reporters: ['spec']
    });
};