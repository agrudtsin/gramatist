angular.
    module('myApp.mainPage', ['ngRoute'])
    //.config(['$routeProvider', function($routeProvider) {
    //    $routeProvider.when('/', {
    //        templateUrl: 'mainPage/mainPage.html',
    //        controller: 'mainCtrl'
    //    });
    //}])
    .controller('mainCtrl', MainCtrl);
function MainCtrl($scope, $http, phrases, dataProvider) {
    $scope.isDefined = true;
    $scope.currentPhrase = {
        text: {
            ru: "",
            en: ""
        }
    };
    $scope.categories = [];
    $scope.phrasesList = [];
    $scope.clearUserText = function(){
        $scope.redText = "";
        $scope.userText = "";
        $scope.redText = "";
        $scope.grayText = "";
        $scope.underlinesText = "";
        $scope.wrongSpaces = "";
    };
    $scope.clearUserText();
    dataProvider.getCategories().
        success(function (data) {
            $scope.categories = data;
            $scope.currentCategory = _.first(data);
        }).
        then(function () {
            $scope.categoryOnChange($scope.currentCategory);

        });

    $scope.onUserTextSpace = function(){
        $scope.userText += " ";
        $scope.onUserTextChange();
    };
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
            if ($scope.isContainErrorSpaces()){
                $scope.userText = _.str.rtrim($scope.userText);
            }
            if ($scope.isContainErrors() || !$scope.isWordFinished()) {
                $scope.userText = phrases.deleteLastWord($scope.userText);
            };
            $scope.grayText = phrases.buildGrayText($scope.currentPhrase.text.en, $scope.userText);
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
                $scope.phraseOnChange(_.first(data));
            })
        $scope.clearUserText();

    };
    $scope.phraseOnChange = function(newPhrase){
        $scope.currentPhrase = newPhrase;
        $scope.clearUserText();
    };

    $scope.isPhrasesEqual = function () {
        return $scope.currentPhrase.text.en == $scope.userText;
    };
    $scope.isContainErrors = function () {
        return phrases.isContainErrors($scope.redText);
    };
    $scope.isContainErrorSpaces = function(){
        return phrases.isContainErrors($scope.wrongSpaces);
    };
    $scope.isWordFinished = function () {
        return phrases.isWordFinished($scope.currentPhrase.text.en, $scope.userText);
    };
    $scope.buildRedText = function () {
        $scope.redText = phrases.buildRedText($scope.currentPhrase.text.en, $scope.userText);
        $scope.wrongSpaces = phrases.buildWrongSpaces($scope.currentPhrase.text.en, $scope.userText);
    }
}

