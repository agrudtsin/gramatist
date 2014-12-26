'use strict';
var beginTime;

angular.module('myApp', []).
    factory('phrases', function () {
        return {
            commands : [],
            pushCommand : function(command){
                return this.commands.push(command);
            },
            flushCommands : function(){
                 this.commands = []
                 return this.commands;
            },
            currentPhrase : {
                text: {
                    ru: "Меня зовут Коля",
                    en: "My name is Nikolay"
                }
            },
            
            makeUnderlinedText : function(userText){
                return underlineUserText(userText);
                
                function underlineUserText(userText){
                    var underlinedText = ""
                    for (var curChar = 0; curChar < userText.length; curChar +=1 ) {
                        if(userText[curChar] == " "){
                            underlinedText += " " ;
                        } else {
                            underlinedText += underlineOrPunctuationМark(userText[curChar]) ;
                        }
                    };  
                    return underlinedText;
                };   
                
                function underlineOrPunctuationМark(character){
                    var punctuationMarks = [',','.',';',':','?','!'];
                    if(punctuationMarks.indexOf(character) !== -1){
                        return character
                    } else {
                        return "_";    
                    }
                };
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
        $scope.userText = "";
        $scope.anotherRedText = "";
        $scope.blueText = "";
        $scope.redText = "";
        $scope.underlinesText = "";// phrases.makeUnderlinedText($scope.userText);
        $scope.grayText = "";
        
        $scope.nativeLanguagePhrase = "Меня зовут Коля";

        $scope.onUserTextChange = function (){
            //underline every character
            $scope.underlinesText = phrases.makeUnderlinedText($scope.userText);
            //for(var currentChar in $scope.userText){
            //    if($scope.userText[currentChar] === " "){
            //        $scope.underlinesText += " ";
            //    } else {
            //        $scope.underlinesText += "_";
            //    }
            //}
            $scope.redText = $scope.userText;

        };

        $scope.onUserTextEnter = function () {
            console.log($scope.userText);
        };
        $scope.FocusOnInput = function() {
            document.getElementById("userText").focus();
        }
    }]);
    