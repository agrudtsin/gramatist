'use strict';

angular.module('myApp', []).
    factory('phrases', function () {
        return {
            commands: [],
            pushCommand: function (command) {
                return this.commands.push(command);
            },
            flushCommands: function () {
                this.commands = [];
                return this.commands;
            },
            currentPhrase: {
                text: {
                    ru: "Меня зовут Коля",
                    en: "My name is Nikolay"
                }
            },

            underlineUserText: function (userText) {
                var underlinedText = "";
                for (var curChar = 0; curChar < userText.length; curChar += 1) {
                    if (userText[curChar] == " ") {
                        underlinedText += " ";
                    } else {
                        underlinedText += this.underlineOrPunctuationМark(userText[curChar]);
                    }
                }
                return underlinedText;
            },

            underlineOrPunctuationМark: function (character) {
                var punctuationMarks = [',', '.', ';', ':', '?', '!'];
                if (_.contains(punctuationMarks, character)) {
                    return character
                } else {
                    return "_";
                }
            },
            buildRedText:function(targetPhrase, userText){
                var redText = "";
                for(var i=0; i < userText.length; i +=1){
                    if(targetPhrase[i] !== userText[i]){
                        redText += userText[i];
                    } else {
                        redText += " ";
                    }
                }
                return redText;

            },

            getCurrent: function () {
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

        //$scope.userText = "";
        $scope.anotherRedText = "";
        $scope.blueText = "";
        $scope.redText = "";
        //$scope.underlinesText = "";// phrases.makeUnderlinedText($scope.userText);
        $scope.grayText = "";

        $scope.phraseComponents = {};
        $scope.phraseComponents.userText = "";
        $scope.phraseComponents.redText = "";
        $scope.phraseComponents.underlinesText = "";
        $scope.phraseComponents.nativeLanguagePhrase = phrases.getCurrent().text.ru;
        $scope.phraseComponents.targetLanguagePhrase = phrases.getCurrent().text.en;

        $scope.onUserTextChange = function (){
            $scope.phraseComponents.underlinesText = phrases.underlineUserText($scope.phraseComponents.userText);
            $scope.phraseComponents.redText = phrases.buildRedText($scope.phraseComponents.targetLanguagePhrase, $scope.phraseComponents.userText);
        };

        $scope.onUserTextEnter = function () {
            console.log($scope.userText);
        };
        $scope.FocusOnInput = function() {
            document.getElementById("userText").focus();
        }
    }]);