/**
 * Created by andrey on 12/14/14.
 */
'use strict';

describe('ext libs stress tests', function () {
    it('jasmine stress test', function () {
        expect(true).toBeTruthy();
    });
    it('underscore stress test', function () {
        expect(_).toBeDefined();
    });
});


describe('phrases service test', function () {
    var phrases;
    beforeEach(function () {
        module('myApp');
        inject(function ($injector) {
            phrases = $injector.get('phrases');
        });
    });
    it('phrases service stress test', function () {
        expect(phrases).toBeDefined();
    });
    xdescribe('phrases service unit tests', function () {
        it('it should append enters to the commands array', function () {
            expect(phrases.commands).toEqual(jasmine.any(Object));
            expect(phrases.commands).not.toContain("Enter");

            phrases.pushCommand("Enter");
            expect(phrases.commands).toContain("Enter");
            expect(phrases.commands.length).toEqual(1);

            phrases.pushCommand("Enter");
            phrases.pushCommand("Enter");
            expect(phrases.commands.length).toEqual(3);

            phrases.pushCommand("Enter");
            expect(phrases.commands.length).toEqual(4);
        });
        it('it should flush the commands array', function () {
            expect(phrases.commands).toEqual(jasmine.any(Object));

            phrases.pushCommand("Enter");
            phrases.pushCommand("Enter");
            phrases.pushCommand("Enter");
            expect(phrases.commands.length).toEqual(3);


            phrases.flushCommands();
            expect(phrases.commands.length).toEqual(0);
        });

    });
    describe('Тесты формирования компонентов фразы', function () {
        it('Каждое пользовательское слово должно быть подчеркнуто', function () {
            expect(phrases.underlineUserText("Вася")).toEqual("____");
            expect(phrases.underlineUserText("Ва")).toEqual("__");
            expect(phrases.underlineUserText("Вася ПМ")).toEqual("____ __");
            expect(phrases.underlineUserText(" Вася")).toEqual(" ____");
            expect(phrases.underlineUserText(" ")).toEqual(" ");
            expect(phrases.underlineUserText("")).toEqual("");
        });
        it('Не должны подчеркиваться знаки пунктуации', function () {
            expect(phrases.underlineUserText("Вася, Коля")).toEqual("____, ____");
            expect(phrases.underlineUserText("Вася,.Коля")).toEqual("____,.____");
            expect(phrases.underlineUserText(".")).toEqual(".");
            expect(phrases.underlineUserText("12.")).toEqual("__.");
            expect(phrases.underlineUserText(".,?!;: q")).toEqual(".,?!;: _");


        });
        it('Неправильные символы выделяем красным, остальные символы - пробелы', function () {
            expect(phrases.buildRedText('My name is Nikolay', "My Name")).toEqual("   N   ");
            expect(phrases.buildRedText('My name is Nikolay', "")).toEqual("");
            expect(phrases.buildRedText('My name is Nikolay', " ")).toEqual(" ");
            expect(phrases.buildRedText('My name is Nikolay', "My name Nikola")).toEqual("        Nikola");
        });
        it('Не должны давать пользователю вносить следующее слово, если в текущем слове есть ошибки', function () {
            expect(phrases.cropUserTextIfContainErrors('My name is Nikolay', "My Name fedor")).toEqual("My Name "); //two words
            expect(phrases.cropUserTextIfContainErrors('My name is Nikolay', "My N")).toEqual("My N"); //two words and last with error
            expect(phrases.cropUserTextIfContainErrors('My name is Nikolay', "My NNme")).toEqual("My NNme"); //two words and last with error
            expect(phrases.cropUserTextIfContainErrors('My name is Nikolay', "My NNme ")).toEqual("My NNme "); //two words and last with error
            expect(phrases.cropUserTextIfContainErrors('My name is Nikolay', "My NNme f")).toEqual("My NNme "); //three words and last with error
            expect(phrases.cropUserTextIfContainErrors('My name is Nikolay', "")).toEqual(""); //no words
            expect(phrases.cropUserTextIfContainErrors('My name is Nikolay', "Myke")).toEqual("Myke");//one word

        });
        it('Когда один раз нажимем Enter - убираем пользовательский текст до первого правильного слова и подчеркиваем текущее слово', function () {
        });

    });
});

describe('myApp controller', function () {
    var $scope;
    beforeEach(module('myApp'));
    beforeEach(inject(function ($rootScope, $controller) {
        $scope = $rootScope.$new();
        $controller('mainCtrl', {$scope: $scope});
    }));
    it('mainCtrl should be defined', function () {
        expect($scope.isDefined).toBeTruthy();
    });
    
    it('should be trothy when user phrases equal', function(){

        $scope.currentPhrase.text.en = "qwe";
        $scope.userText = "qwertu";
        expect($scope.isPhrasesEqual()).not.toBeTruthy();

        console.log("curPrase", $scope.currentPhrase);
        $scope.currentPhrase.text.en = "qwe";
        $scope.userText = "qwe";
        expect($scope.isPhrasesEqual()).toBeTruthy();


    });
    
});
