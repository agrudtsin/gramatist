module.exports = function(config){
  config.set({

    basePath : './',

    files : [

        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'app/bower_components/angular-resource/angular-resource.js',

        'app/bower_components/firebase/firebase.js',
        'app/bower_components/mockfirebase/browser/mockfirebase.js',
        'app/bower_components/angularfire/dist/angularfire.js',

        'app/bower_components/underscore/underscore.js',

        'app/app.js',
        'app/app_test.js',
        'app/authentication/auth.js',
        'app/authentication/auth_test.js'
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
