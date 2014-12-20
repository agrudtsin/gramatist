'use strict';

angular.module('myApp', ['ngResource']).
    factory('dataProvider', ['$http',
        function($http){
            return {
                getCategories: function(){
                    return $http.get('phrases/phrases.json');
                },
                getPhrasesByID : function(id){
                    return $http.get('phrases/'+id+'.json');
                },
                getPhrasesArrayById:function(id){
                    $http.get('phrases/'+id+'.json').
                    success(function(data){
                            return data;
                        }).
                    error(function(){
                            return [];
                        }
                    );
                }
            }
        }]).
    factory('phrases',['$http','dataProvider', function ($http, dataProvider) {
       var phrasesObj = {
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
            categories:[],
            phrasesList:[]
        };

        dataProvider.getCategories().success(function(data){
            phrasesObj.categories = data;
        });

        return phrasesObj;
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
    controller('mainCtrl', ['$scope', '$http', 'phrases', 'dataProvider', function($scope, $http, phrases, dataProvider) {
        $scope.isDefined = true;
        $scope.anotherRedText = "";
        $scope.blueText = "";
        $scope.redText = "";
        $scope.userText = "";
        $scope.redText = "";
        $scope.underlinesText = "";
        $scope.currentPhrase = {
            text : {
                ru : "",
                en : ""
            }
        };
        $scope.categories = [];
        $scope.phrasesList = [];

        dataProvider.getCategories().
            success(function(data){
                $scope.categories = data;
                $scope.currentCategory = _.first(data);
            }).
            then(function(){
                $scope.categoryOnChange($scope.currentCategory);

            });



        $scope.onUserTextChange = function (){
            $scope.underlinesText = phrases.underlineUserText($scope.userText);
            $scope.userText = phrases.cropUserTextIfContainErrors($scope.currentPhrase.text.en, $scope.userText);
            $scope.redText = phrases.buildRedText($scope.currentPhrase.text.en, $scope.userText);
        };
        $scope.onUserTextEnter = function () {
        };
        $scope.categoryOnChange = function(newCategory){
            $scope.currentCategory = newCategory;
            dataProvider.getPhrasesByID($scope.currentCategory.id).
                success(function(data){
                    $scope.phrasesList = data;
                    $scope.currentPhrase = _.first(data);
                })

        };
$scope.isPhrasesEqual = function(){
            return $scope.currentPhrase.text.en == $scope.userText;
        }
    }]);