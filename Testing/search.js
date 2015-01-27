/**
 * Created by JGJeffryes on 1/27/15.
 */
var sleep = function() {browser.driver.sleep(1000)};
describe('quick search', function() {
    browser.get('http://localhost:8888/#/home');

    var quickSearch = element(by.model('name'));
    var qsButton = element(by.id('qs_btn'));
    var items = element.all(by.id("comp-row"));


    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('MINE');
    });

    it('should do quick search', function(){
        quickSearch.sendKeys('ATP');
        qsButton.click();
        sleep();
        expect(items.count()).toEqual(1);
        expect(element(by.binding('compound.MINE_id')).getText()).toEqual('12815')
    });

    it('should have working links', function(){
        items.first().click();
        sleep();
        expect(element(by.binding('data.Names[0]')).getText()).toEqual('ATP')
    });
});

describe(' advanced search', function() {
    browser.get('http://localhost:8888/#/advancedsearch');

    it('should have help text', function() {
        expect(browser.getTitle()).toEqual('MINE');
    });

    it('should do quick search', function(){
        quickSearch.sendKeys('ATP');
        qsButton.click();
        sleep();
        expect(items.count()).toEqual(1);
        expect(element(by.binding('compound.MINE_id')).getText()).toEqual('12815')
    });

    it('should have working links', function(){
        items.first().click();
        sleep();
        expect(element(by.binding('data.Names[0]')).getText()).toEqual('ATP')
    });
});