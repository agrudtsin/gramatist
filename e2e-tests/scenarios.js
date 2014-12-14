'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  describe('Стресс тесты: ', function () {

    beforeEach(function() {
      browser.get('index.html');
    });


    it('Должен быть правильный заголовок', function () {
      expect(browser.getTitle()).toBe("Граматист - практическое изучение английского языка");
    });

    it('Позволяет ввоить пользовательски текст', function () {
      element(by.model('userText')).sendKeys("Test");
      expect(element(by.id('userText')).getAttribute("value")).toBe("Test");
    });

  });

  describe('Система делает подсказки при нажатии на Enter: ', function () {

    beforeEach(function() {
      browser.get('index.html');
    });

    it('Не позволяет вводить Enter', function () {
      element(by.model('userText')).sendKeys(protractor.Key.ENTER);
      expect(element(by.id('userText')).getAttribute("value")).toBe("");
    });
  });
});
