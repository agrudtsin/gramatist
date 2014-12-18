'use strict';

angular.module('myApp', []).
    factory('phrases',['$http', function ($http, $rootScope) {
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
                    ru: "Стандартная фраза",
                    en: "Default phrase"
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
            buildRedText : function(targetPhrase, userText){
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
            cropUserTextIfContainErrors : function(targetPhrase, userText){
                var croppedUserText = userText.slice();
                var isContainErrors = [' '].toString() != _.uniq(this.buildRedText(targetPhrase, userText)).toString();
                var isContainErrorsInPreviousWord = [" "].toString() != _.uniq(this.buildRedText(targetPhrase, cropLastWord(userText))).toString();
                if(isContainErrors && isContainErrorsInPreviousWord) {
                    croppedUserText = cropLastWord(croppedUserText);
                }
                return croppedUserText;

                function cropLastWord(str){
                    var lastIndex = str.lastIndexOf(' '); //pre last index of space
                    if(lastIndex > 0 ){
                        return str.substring(0, lastIndex) + ' ';
                    } else {
                        return str;
                    }
                }

                function isWordEnded(croppedUserText){
                    return _.last(croppedUserText) === ' ';
                }
            },
            getCurrent: function () {
                return this.currentPhrase;
            },
            phrasesArray:[]
        }
    }]).
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
    controller('mainCtrl', ['$scope', '$http', 'phrases', function($scope, $http, phrases) {
        $scope.isDefined = true;

        //$scope.userText = "";
        $scope.anotherRedText = "";
        $scope.blueText = "";
        $scope.redText = "";
        //$scope.underlinesText = "";// phrases.makeUnderlinedText($scope.userText);
        $scope.grayText = "";

        $http.get('phrases/phrases.json').success(function(data){
            phrases.phrasesArray = data;
            phrases.currentPhrase = _.first(phrases.phrasesArray);
            $scope.phraseComponents.nativeLanguagePhrase = phrases.currentPhrase.text.ru;
            $scope.phraseComponents.targetLanguagePhrase = phrases.currentPhrase.text.en;
        });

        $scope.phraseComponents = {};
        $scope.phraseComponents.userText = "";
        $scope.phraseComponents.redText = "";
        $scope.phraseComponents.underlinesText = "";


        $scope.onUserTextChange = function (){
            $scope.phraseComponents.underlinesText = phrases.underlineUserText($scope.phraseComponents.userText);
            $scope.phraseComponents.userText = phrases.cropUserTextIfContainErrors($scope.phraseComponents.targetLanguagePhrase, $scope.phraseComponents.userText);
            $scope.phraseComponents.redText = phrases.buildRedText($scope.phraseComponents.targetLanguagePhrase, $scope.phraseComponents.userText);
        };

        $scope.onUserTextEnter = function () {
            console.log($scope.userText);
        };
        $scope.FocusOnInput = function() {
            document.getElementById("userText").focus();
        };

        $scope.isPharsesEqual = function(){
            return $scope.phraseComponents.targetLanguagePhrase == $scope.phraseComponents.userText;
        }
    }]);