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
    directive('ngEnter', function () {  //http://stackoverflow.com/questions/17470790/how-to-use-a-keypress-event-in-angularjs
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
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

        };

        $scope.onUserTextEnter = function () {
            console.log($scope.userText);
        }
    }]);