'use strict';
_.mixin(_.string.exports());

angular.
    module('myApp', [
        'ngResource',
        'myApp.mainPage']).
    factory('dataProvider', ['$http', DataProvider]).
    factory('phrases', ['$http', 'dataProvider', Phrases]).
    directive('ngEnter', ngEnter);



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
        buildGrayText:function(targetPhrase, userText){
            var grayText = "";
            grayText =_.reduce(_.string.trim(userText), function(memo,context){return memo+=" "},"");//replace all chars by spaces
            grayText += " "+ _.string.words(targetPhrase)[_.string.words(userText).length];// add next word from targetPhrase
            if(_.string.words(userText).length == 0) grayText = grayText.slice(1);//remove first space if no words in user text
            return grayText;
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
