module.exports = function(config){
  config.set({

    basePath : './',

    files : [
        'app/bower_components/underscore/underscore.js',
        'app/bower_components/underscore.string/lib/underscore.string.js',
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'app/bower_components/angular-resource/angular-resource.js',
        'app/app.js',
        'app/app_test.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    // hostname : process.env.IP,
    port : 8082,
    runnerPort : 0,

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
