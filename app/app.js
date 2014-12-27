'use strict';
_.mixin(_.string.exports());

angular.
    module('myApp', ['ngResource']).
    factory('dataProvider', ['$http', DataProvider]).
    factory('phrases', ['$http', 'dataProvider', Phrases]).
    directive('ngEnter', ngEnter).
    controller('mainCtrl', MainCtrl);


function DataProvider($http) {
    return {
        getCategories: function () {
            return $http.get('phrases/phrases.json');
        },
        getPhrasesByID: function (id) {
            return $http.get('phrases/' + id + '.json');
        },
        getPhrasesArrayById: function (id) {
            $http.get('phrases/' + id + '.json').
                success(function (data) {
                    return data;
                }).
                error(function () {
                    return [];
                }
            );
        }
    }
}
function Phrases($http, dataProvider) {
    var phrasesObj = {
        currentPhrase: {
            text: {
                ru: "Стандартная фраза",
                en: "Default phrase"
            }
        },
        deleteLastWord: function (userText) {
            var resultText = _.str.rtrim(userText, " ");
            var lastSpacePosition = resultText.lastIndexOf(' ');
            if (lastSpacePosition > 0) {
                return _.str.rtrim(resultText.substring(0, lastSpacePosition), " ") + ' ';
            } else {
                return "";
            }
        },
        deleteLastSpace: function (text) {
            return _.string.rtrim(text, ' ');
        },
        buildUnderlinedTextByString: function (userText) {
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
        buildRedText: function (targetPhrase, userText) {
            var redText = "";
            for (var i = 0; i < userText.length; i += 1) {
                if (targetPhrase[i] !== userText[i]) {
                    redText += userText[i];
                } else {
                    redText += " ";
                }
            }
            return redText;

        },
        isContainErrors: function (redText) {
            return ' ' != _.uniq(redText).toString() && '' != _.uniq(redText).toString()
        },
        cropUserTextIfContainErrors: function (targetPhrase, userText) {
            var isContainErrors = this.isContainErrors(this.buildRedText(targetPhrase, userText));
            var isContainErrorsInPreviousWord = this.isContainErrors(this.buildRedText(targetPhrase, this.deleteLastWord(userText)));
            if (isContainErrors && isContainErrorsInPreviousWord) {
                return this.deleteLastWord(userText)
            } else {
                return userText;
            }
        },
        getCurrent: function () {
            return this.currentPhrase;
        },
        categories: [],
        phrasesList: []
    };

    dataProvider.getCategories().success(function (data) {
        phrasesObj.categories = data;
    });

    return phrasesObj;
}
function ngEnter() {
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
}
function MainCtrl($scope, $http, phrases, dataProvider) {
    $scope.isDefined = true;
    $scope.anotherRedText = "";

    $scope.redText = "";
    $scope.userText = "";
    $scope.redText = "";
    $scope.grayText = "";
    $scope.underlinesText = "";
    $scope.currentPhrase = {
        text: {
            ru: "",
            en: ""
        }
    };
    $scope.categories = [];
    $scope.phrasesList = [];

    dataProvider.getCategories().
        success(function (data) {
            $scope.categories = data;
            $scope.currentCategory = _.first(data);
        }).
        then(function () {
            $scope.categoryOnChange($scope.currentCategory);

        });

    $scope.onUserTextChange = function () {
        $scope.userText = phrases.cropUserTextIfContainErrors($scope.currentPhrase.text.en, $scope.userText);
        $scope.buildRedText();
        $scope.grayText = "";
    };
    $scope.onUserTextEnter = function () {
        if (useEnterInTheEndOfPhrase()) return;
        if (useEntersToUnderlineText()) return;
        useTwoEntersToShowGrayedText();

        function useTwoEntersToShowGrayedText() {
            $scope.grayText = $scope.currentPhrase.text.en;
            if ($scope.isContainErrors()) $scope.userText = phrases.deleteLastWord($scope.userText);
            $scope.buildRedText();
        };
        function useEntersToUnderlineText() {
            if (isAllPhraseAlreadyUnderlined()) return false; //phrase already underined
            $scope.underlinesText = phrases.buildUnderlinedTextByString($scope.currentPhrase.text.en);
            return true;
        };
        function isAllPhraseAlreadyUnderlined() {
            return $scope.currentPhrase.text.en.length == $scope.underlinesText.length
        };
        function useEnterInTheEndOfPhrase() {
            if ($scope.isPhrasesEqual()) {
                $scope.userText = $scope.redText = $scope.underlinesText = $scope.grayText = "";
                if ($scope.currentPhrase != _.last($scope.phrasesList)) setNextPhrase();
                else setNextCategory();
                return true;
            }
            return false;

            function setNextPhrase() {
                $scope.currentPhrase = $scope.phrasesList[_.indexOf($scope.phrasesList, $scope.currentPhrase) + 1];
            };
            function setNextCategory() {
                if ($scope.categories != _.last($scope.currentCategory)) {
                    $scope.categoryOnChange($scope.categories[_.indexOf($scope.categories, $scope.currentCategory) + 1]);
                } else {
                    $scope.categoryOnChange(_.first($scope.categories));
                };

            }
        }
    };
    $scope.categoryOnChange = function (newCategory) {
        $scope.currentCategory = newCategory;
        dataProvider.getPhrasesByID($scope.currentCategory.id).
            success(function (data) {
                $scope.phrasesList = data;
                $scope.currentPhrase = _.first(data);
            })
    };
    $scope.isPhrasesEqual = function () {
        return $scope.currentPhrase.text.en == $scope.userText;
    };
    $scope.isContainErrors = function () {
        return phrases.isContainErrors($scope.redText);
    };
    $scope.buildRedText = function () {
        $scope.redText = phrases.buildRedText($scope.currentPhrase.text.en, $scope.userText);
    }
}