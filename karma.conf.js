module.exports = function(config){
  config.set({

    basePath : './',

    files : [
        'app/bower_components/underscore/underscore.js',
        'app/bower_components/underscore.string/lib/underscore.string.js',
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'app/bower_components/angular-resource/angular-resource.js',
        'app/bower_components/angular-route/angular-route.js',
        'app/app.js',
        'app/mainPage/mainPage.js',
        'app/app_test.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

      // coverage reporter generates the coverage
      reporters: ['progress', 'coverage'],

      preprocessors: {
          // source files, that you wanna generate coverage for
          // do not include tests or libraries
          // (these files will be instrumented by Istanbul)
          'app/app.js': ['coverage']
      },

// optionally, configure the reporter
      coverageReporter: {
          type : 'html',
          dir : 'temp/coverage/'
      },

    browsers : ['PhantomJS'],

    // hostname : process.env.IP,
    port : 8082,
    runnerPort : 0,

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-js-coverage'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
