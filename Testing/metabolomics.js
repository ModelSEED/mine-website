/**
 * Created by JGJeffryes on 2/17/15.
 */
var sleep = function() {browser.driver.sleep(1500)};
var adducts = element(by.model('adducts')).all(by.tagName('option'));
var searchBtn = element(by.partialButtonText('Search'));
describe('metabolomics form', function() {
    beforeAll(function () {
        browser.get('http://localhost:8888/#/metabolomics');
        sleep();
    });
    var models = element.all(by.repeater('s in modelList'));

    it('should load the form and adducts', function() {
        expect(adducts.count()).toEqual(33);
        expect(adducts.first().getText()).toEqual('[M]+');
        expect(searchBtn.isEnabled()).toBe(false);
        element(by.id('neg-radio')).click();
        expect(adducts.count()).toEqual(15);
    });

    it('should have working model selection', function() {
        element(by.model('model_term')).sendKeys('yeast');
        sleep();
        expect(models.count()).toEqual(8);
        expect(models.first().getText()).toEqual('Ascomycetes');
        models.get(1).click();
        expect(element.all(by.repeater('m in selectedModels')).first().getText()).toEqual('Eukaryotes');
    });

    it('should search', function() {
        adducts.first().click();
        expect(searchBtn.isEnabled()).toBe(true);
        searchBtn.click();
        sleep();
    });

    it('should remember selected adducts', function() {
        browser.navigate().back();
        expect(adducts.first().isSelected()).toBe(true);
        expect(searchBtn.isEnabled()).toBe(true);
    });
});
describe('metabolomics results', function(){
    beforeAll(function () {
        element(by.id('pos-radio')).click();
        adducts.get(2).click();
        searchBtn.click();
        sleep();
    });
    var rows = element.all(by.repeater('f in displayData'));
    var itemCount = element(by.binding('totalItems'));

    it('should display the compounds', function() {
        expect(itemCount.getText()).toEqual('138 of 138 total hits');
        expect(rows.count()).toEqual(25)
    });

    it('should highlight model compounds', function() {
        expect(rows.get(2).getCssValue('color')).toEqual('rgba(0, 0, 0, 1)');
        expect(rows.get(3).getCssValue('color')).toEqual('rgba(66, 139, 202, 1)');
        sleep();

    });

    it('should sort compounds', function() {
        element(by.id('sort-NP')).click();
        expect(rows.get(0).element(by.binding('f.MINE_id')).getText()).toEqual('7778');
        element(by.id('sort-NP')).click();
        expect(rows.get(0).element(by.binding('f.MINE_id')).getText()).toEqual('55170');
    });

    it('should paginate correctly', function() {
        element(by.linkText('Last')).click();
        expect(rows.count()).toEqual(13);
        expect(itemCount.getText()).toEqual('138 of 138 total hits');
        element(by.model('searchMINE')).sendKeys('11');
        expect(rows.count()).toEqual(9);
        expect(itemCount.getText()).toEqual('9 of 138 total hits');
        element(by.model('searchMINE')).clear();
        expect(rows.count()).toEqual(25);
        expect(itemCount.getText()).toEqual('138 of 138 total hits');
    });

    it('should download compounds', function() {
        element(by.buttonText('Download Results')).click();
        sleep();
        //do more checking here
        //http://stackoverflow.com/questions/21935696/protractor-e2e-test-case-for-downloading-pdf-file
    });

    it('should have working links', function() {
        rows.first().click();
        sleep();
        expect(element(by.binding('data.MINE_id')).getText()).toEqual('Compound 55170');
    });
});