/**
 * Created by andrey on 12/14/14.
 */
'use strict';

describe('myApp stress tests', function() {

    describe('ext libs stress tests', function(){

        it('jasmine stress test', function() {
            expect(true).toBeTruthy();
        });

        it('underscore stress test', function() {
            expect(_).toBeDefined();
        });
    });

    
     describe('phrases service test', function(){
        var phrases;
        
        beforeEach(function() {
            module('myApp');
            inject(function($injector) {
                phrases = $injector.get('phrases');
            });
        });
        
        it('phrases service stress test', function() {
            expect(phrases).toBeDefined();
        });
        
        describe('phrases service unit tests', function(){
            it('it should append enters to the commands array', function() {
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
            it('it should flush the commands array', function() {
                expect(phrases.commands).toEqual(jasmine.any(Object));
                
                phrases.pushCommand("Enter");
                phrases.pushCommand("Enter");
                phrases.pushCommand("Enter");
                expect(phrases.commands.length).toEqual(3);
                
                
                phrases.flushCommands();
                expect(phrases.commands.length).toEqual(0);
            });
            
        });
        describe('Тесты логики формирования подчеркнутого текста', function(){
            it('Каждое пользовательское слово должно быть подчеркнуто', function() {
                expect(phrases.makeUnderlinedText("Вася", [])).toEqual("____");
                expect(phrases.makeUnderlinedText("Ва", [])).toEqual("__");
                expect(phrases.makeUnderlinedText("Вася ПМ", [])).toEqual("____ __");
                expect(phrases.makeUnderlinedText(" Вася", [])).toEqual(" ____");
                expect(phrases.makeUnderlinedText(" ", [])).toEqual(" ");
                expect(phrases.makeUnderlinedText("", [])).toEqual("");
            });
            it('Не должны подчеркиваться знаки пунктуации', function() {
                expect(phrases.makeUnderlinedText("Вася, Коля", [])).toEqual("____, ____");
                expect(phrases.makeUnderlinedText("Вася,.Коля", [])).toEqual("____,.____");
                expect(phrases.makeUnderlinedText(".", [])).toEqual(".");
                expect(phrases.makeUnderlinedText("12.", [])).toEqual("__.");
                expect(phrases.makeUnderlinedText(".,?!;: q", [])).toEqual(".,?!;: _");
                
                
            });
            it('Когда один раз нажимем Enter - подчеркивается слово', function() {
            
            });
        });
        
    });

    describe('myApp controller', function(){
        var $scope;
        beforeEach(module('myApp'));
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            $controller('mainCtrl', {$scope: $scope});
        }));

        it('mainCtrl should be defined', function() {
            expect($scope.isDefined).toBeTruthy();
        });

    });
});
