/**
 * Created by JGJeffryes on 2/6/15.
 */
var sleep = function() {browser.driver.sleep(1000)};
describe('compound page', function() {
    beforeAll(function () {
        browser.get('http://localhost:8888/#/acompound46308/overview');
        sleep()
    });
    var items = element.all(by.repeater('reaction in filteredData'));
    var img = element.all(by.css('[width="80"]')).first();
    it('should load', function(){
        expect(element(by.binding('data.MINE_id')).getText()).toEqual('Compound 46308');
        expect(element(by.binding('data.Product_of.length+0')).getText()).toEqual('Product of (44)')
    });
    it('should display reactant reactions', function() {
        element(by.binding('data.Reactant_in.length+0')).click();
        sleep();
        expect(items.count()).toEqual(25);

        /* I haven't had any luck checking to see if the popovers are working correctly
        browser.actions().mouseMove(img).perform();
        sleep();
        expect(element(by.id('img-popover')).isDisplayed()).toBeTruthy();*/
    });
    it('should paginate reactant reactions correctly', function(){
        element(by.linkText('2')).click();
        sleep();
        expect(items.count()).toEqual(24);
    });
    it('should link to other compound pages', function(){
        img.element(by.xpath('..')).click();
        sleep();
        expect(element(by.binding('data.MINE_id')).getText()).toEqual('Compound 46308');
    });
    it('should display product reactions', function() {
        element(by.binding('data.Product_of.length+0')).click();
        sleep();
        expect(items.count()).toEqual(25);

        /*browser.actions().mouseMove(img).perform();
        sleep();
        expect(element(by.id('img-popover')).isDisplayed()).toBeTruthy();*/
    });
    it('should paginate product reactions correctly', function(){
        element(by.linkText('2')).click();
        sleep();
        expect(items.count()).toEqual(19);
    });
    it('should link to operator pages', function(){
        element(by.binding('op')).click();
        sleep();
        expect(element(by.binding('operatorName')).getText()).toEqual('Operator 4.2.1.d');
    });
});