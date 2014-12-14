'use strict';

angular.module('myApp', []).
    controller('mainCtrl', ['$scope', function($scope) {
        $scope.isDefined = true;
        $scope.nativeLanguagePhrase = "Меня зовут Коля";

        $scope.anotherRedText = $scope.nativeLanguagePhrase;
        $scope.redText = "";
        $scope.grayText = "";
        $scope.userText = "";
        $scope.nativeLanguagePhrase = "Меня зовут Коля";
    }]);