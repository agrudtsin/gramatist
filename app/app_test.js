/**
 * Created by andrey on 12/14/14.
 */
'use strict';

describe('myApp stress tests', function() {

    describe('jasmine stress test', function(){

        it('jasmine stress test', function() {
            expect(true).toBeTruthy();
        });



    });

    describe('myApp controller', function(){
        var $scope;
        beforeEach(module('myApp'));
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            $controller('mainCtrl', {$scope: $scope});
        }));

        it('mainCtrl should be defined', function() {
            expect($scope.isDefined).toBeTruthy();
        });

    });
});
