// conf.js
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['search.js','compoundPages.js', 'metabolomics.js'],
  //specs: ['metabolomics.js'],
  framework: 'jasmine2',
  onPrepare: function() {
    browser.driver.manage().window().setSize(1200, 1000);
  },
  multiCapabilities: [
    {browserName: 'firefox'},
    {browserName: 'chrome'}
  ]
};

