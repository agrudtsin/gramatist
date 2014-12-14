'use strict';

angular.module('myApp', []).
    factory('phrases', function () {
        return {
            currentPhrase : {
                text: {
                    ru: "Меня зовут Коля",
                    en: "My name is Nikolay"
                }
            },

            getCurrent : function(){
                return this.currentPhrase;
            }

        }
    }).
    controller('mainCtrl', ['$scope', 'phrases', function($scope, phrases) {
        $scope.isDefined = true;
        $scope.nativeLanguagePhrase = phrases.getCurrent().text.ru;

        $scope.anotherRedText = "";
        $scope.blueText = "";
        $scope.redText = "";
        $scope.underlinesText = "";
        $scope.grayText = "";
        $scope.userText = "";
        $scope.nativeLanguagePhrase = "Меня зовут Коля";

        $scope.onUserTextChange = function (){
            //underline every character
            $scope.underlinesText = "";
            for(var currentChar in $scope.userText){
                if($scope.userText[currentChar] === " "){
                    $scope.underlinesText += " ";
                } else {
                    $scope.underlinesText += "_";
                }
            }
            $scope.redText = $scope.userText;

        }

    }]);