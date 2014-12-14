'use strict';

angular.module('myApp', []).
    controller('mainCtrl', ['$scope', function($scope) {
        $scope.isDefined = true;
    }]);