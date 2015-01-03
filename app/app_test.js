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
            expect(phrases.buildUnderlinedTextByString("Вася")).toEqual("____");
            expect(phrases.buildUnderlinedTextByString("Ва")).toEqual("__");
            expect(phrases.buildUnderlinedTextByString("Вася ПМ")).toEqual("____ __");
            expect(phrases.buildUnderlinedTextByString(" Вася")).toEqual(" ____");
            expect(phrases.buildUnderlinedTextByString(" ")).toEqual(" ");
            expect(phrases.buildUnderlinedTextByString("")).toEqual("");
        });
        it('Не должны подчеркиваться знаки пунктуации', function () {
            expect(phrases.buildUnderlinedTextByString("Вася, Коля")).toEqual("____, ____");
            expect(phrases.buildUnderlinedTextByString("Вася,.Коля")).toEqual("____,.____");
            expect(phrases.buildUnderlinedTextByString(".")).toEqual(".");
            expect(phrases.buildUnderlinedTextByString("12.")).toEqual("__.");
            expect(phrases.buildUnderlinedTextByString(".,?!;: q")).toEqual(".,?!;: _");


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
        xit('Когда один раз нажимем Enter - убираем пользовательский текст до первого правильного слова и подчеркиваем текущее слово', function () {
        });

    });
});

describe('myApp controller', function () {
    var $scope;
    beforeEach(module('myApp'));
    beforeEach(inject(function ($rootScope, $controller) {
        $scope = $rootScope.$new();
        $controller('mainCtrl', {$scope: $scope});
        $scope.categories =  [{
            "name": "Тестовые фразы",
            "id": "1.1.1.3_Perfect"
        },
        {
            "name": "Тестовые фразы 2",
            "id": "1.1.2_Past"
        }];
        $scope.phrasesList = [
            {
                "text": {
                    "ru": "Меня зовут Андрей",
                    "en": "My name is Andrey"
                }
            },
            {
                "text": {
                    "ru": "Фраза номер два",
                    "en": "Phrase number two"
                }
            },
            {
                "text": {
                    "ru": "Фраза номер три",
                    "en": "Phrase number three"
                }
            }
        ];
        $scope.currentPhrase = _.first($scope.phrasesList);
        $scope.currentCategory = _.first($scope.categories);
        $scope.userText = "";
        $scope.underlinesText = "";
        $scope.grayText = "";

    }));
    it('mainCtrl should be defined', function () {
        expect($scope.isDefined).toBeTruthy();
    });
    it('should be trothy when user phrases equal', function(){
        expect($scope.isPhrasesEqual()).not.toBeTruthy();

        $scope.currentPhrase.text.en = "qwe";
        $scope.userText = "qwe";
        expect($scope.isPhrasesEqual()).toBeTruthy();

        $scope.currentPhrase.text.en = "qwe";
        $scope.userText = "qwertu";
        expect($scope.isPhrasesEqual()).not.toBeTruthy();
    });
    it("По нажатию на Enter, если пользовательская фраза введена правильно, переключается на следующую фразу", function () {

        $scope.userText = $scope.currentPhrase.text.en;
        $scope.onUserTextEnter();
        expect($scope.userText).toEqual(""); //польз. текст очищен
        expect($scope.currentPhrase.text.ru).toEqual("Фраза номер два"); //польз. текст очищен

        $scope.userText = $scope.currentPhrase.text.en;
        $scope.onUserTextEnter();
        expect($scope.userText).toEqual(""); //польз. текст очищен
        expect($scope.currentPhrase.text.ru).toEqual("Фраза номер три");
    });
    it("Когда списк фраз походит к концу - переключаемся на следующую категорию", function () {

        $scope.userText = $scope.currentPhrase.text.en;
        $scope.onUserTextEnter();

        $scope.userText = $scope.currentPhrase.text.en;
        $scope.onUserTextEnter();

        $scope.userText = $scope.currentPhrase.text.en;
        $scope.onUserTextEnter();


       expect($scope.currentCategory.name).toEqual("Тестовые фразы 2"); //польз. текст очищен
       //expect($scope.userText).toEqual(""); //польз. текст очищен
        //expect($scope.currentPhrase.text.ru).toEqual("Фраза номер три");
    });
    describe("При первом нажатии на Энтер выводим все почеркивания", function () {
        it("Пользовательский текст пустой; срузу жмем Энтер", function () {
            $scope.onUserTextEnter();
            expect($scope.underlinesText).toEqual("__ ____ __ ______"); //My name is Andrey
        });
        it("В тексте есть знаки припинания", function () {
            $scope.currentPhrase.text.en = " ;,. test ";
            $scope.onUserTextEnter();
            expect($scope.underlinesText).toEqual(" ;,. ____ "); //" ;,. test "
        });
        it("Пользовательский тект уже на половину введен", function () {
            $scope.userText = "My name";
            $scope.onUserTextEnter();
            expect($scope.underlinesText).toEqual("__ ____ __ ______"); //My name is Andrey
        });
        it("После того как фраза введена полностью - очищаем подчеркивания", function () {
            $scope.userText = $scope.currentPhrase.text.en;
            $scope.onUserTextEnter();
            expect($scope.underlinesText).toEqual(""); //My name is Andrey
        });


    });
    describe("При втором нажатии на энтер подсказываем слово серым текстом", function () {
        xit("Пользовательский текст пустой; срузу жмем Энтер два раза", function () {
            $scope.onUserTextEnter();
            $scope.onUserTextEnter();
            expect($scope.grayText).toEqual("My"); //My name is Andrey
        });

        xit("Пользовательский тект уже на половину введен", function () {
            $scope.userText = "My name";
            $scope.onUserTextEnter();
            $scope.onUserTextEnter();
            expect($scope.grayText).toEqual("        is"); //My name is Andrey
        });

        xit("Пользовательский тект содержит ошибку", function () {
            $scope.userText = "My test";
            $scope.onUserTextEnter();
            $scope.onUserTextEnter();
            expect($scope.grayText).toEqual("   name"); //My name is Andrey
            expect($scope.userText).toEqual("My ");
            expect($scope.redText).toEqual("   "); //My name is Andrey
        });
    });

    //https://github.com/agrudtsin/gramatist/issues/20
    it("При выборе категории очищается пользовательский текст, почеркивание, красный и серый текст", function () {

        $scope.userText = "userText";
        $scope.grayText = "grayText";
        $scope.redText = "redText";
        $scope.underlinesText = "underlinesText";
        $scope.categoryOnChange(_.first($scope.categories ));
        expect($scope.userText).toEqual("");
        expect($scope.grayText).toEqual("");
        expect($scope.underlinesText).toEqual("");
        expect($scope.redText).toEqual("");

    });


});
