/**
 * Created by JGJeffryes on 1/27/15.
 */
var sleep = function() {browser.driver.sleep(1000)};
describe('quick search', function() {
    beforeAll(function() {
        browser.get('http://localhost:8888/#/home');
    });

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

    it('should update if the database is changed', function(){

    });

    it('should have working links', function(){
        items.first().click();
        sleep();
        expect(element(by.binding('data.Names[0]')).getText()).toEqual('ATP')
    });

});

describe('advanced search', function() {
    beforeAll(function() {
        browser.get('http://localhost:8888/#/advancedsearch');
        sleep()
    });
    var helpText = element(by.id('help-text'));
    var searchBtn = element(by.id('search-btn'));
    var regex = element(by.model('RegEx'));
    var val = element(by.model('value'));
    var or = element.all(by.repeater('x in or track by $index'));

    it('should load', function() {
        expect(helpText.isDisplayed()).toBe(true);
        expect(element.all(by.options('f.name for f in fields')).count()).toBe(24);
        //expect(searchBtn.isEnabled()).toBe(false);
    });

    it('should have working options', function(){
        regex.click();
        expect(regex.isSelected()).toBe(true);
        element(by.id('not-radio')).click();
        expect(regex.isSelected()).toBe(false);
        expect(regex.isEnabled()).toBe(false);
    });

    it('should add and remove items from arrays', function(){
        val.sendKeys('Foo');
        element(by.buttonText('Or')).click();
        expect(or.count()).toBe(1);
        element(by.id('del')).click();
        expect(or.count()).toBe(0);
    });

    it('should do an advanced search', function(){
        browser.get('http://localhost:8888/#/advancedsearch');
        sleep();
        val.sendKeys('C25a9fafebc1b08a0ae0fec015803771c73485a61');
        element(by.buttonText('And')).click();
        searchBtn.click();
        sleep();
        expect(element.all(by.id("comp-row")).count()).toBe(1)
    });

    it('should update if the database is changed', function(){

    });
});