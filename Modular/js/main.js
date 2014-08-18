angular.module('app',['ui.router','ui.bootstrap','ngCookies']);
angular.module('app').factory('currentState', function(){
    return 'home';
});

angular.module('app').controller('cookieCtl',function($scope,$cookies,$cookieStore) {
    var visited = $cookieStore.get('mine');
    if( typeof(visited) == 'undefined') {
        $cookieStore.put('mine', "mine_visitor");
        var tour = new Tour(generalTour());
        tour.init();
        tour.start();
    }
});

// default contoler on the mine quick search is in quicksearch.js

angular.module('app').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');
    //HOME
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'partials/home.html',
        contoler: "resetCtl"
    });
    //FAQ
    $stateProvider.state('faq', {
        url: '/faq',
        templateUrl: 'partials/FAQ.html',
        contoler: "resetCtl"
    });

    // COMPOUNDS QUICK SEARCH see compounds.js
    $stateProvider.state('compounds', {
        url: '/compounds:search',
        templateUrl: 'partials/compounds.html',
        controller: "compoundsCtl"
    });


    // AN INDIVIDUAL COMPOUND see acompound.js
    $stateProvider.state('acompound', {
        url: '/acompound:id',
        templateUrl: 'partials/acompound.html',
        controller: "acompoundCtl"
    });
    $stateProvider.state('acompound.overview', {
        url: '/overview',
        templateUrl: 'partials/overview.html',
        contoler: "resetCtl"
    });
    $stateProvider.state('acompound.reactants', {
        url: '/reactants',
        templateUrl: 'partials/reactions.html',
        controller: "reactantsCtl"
    });
    $stateProvider.state('acompound.products', {
        url: '/products',
        templateUrl: 'partials/reactions.html',
        controller: "productsCtl"
    });


    //METABLOMICS see metablomics.js
    $stateProvider.state('metablomics', {
        url: '/metablomics',
        templateUrl: 'partials/metablomics.html',
        controller: "metablomicsCtl"
    });
    $stateProvider.state('metablomicsCompounds', {
        url: '/metablomicsCompounds:search',
        templateUrl: 'partials/list.html',
        controller: "metablomicsCompoundsCtl"
    });

    $stateProvider.state('AlterateMetablomicsCompounds', {
      url: '/AlterateMetablomicsCompounds:search',
      templateUrl: 'partials/metaboliteslist.html',
      controller: "altMetablomicsCompoundsCtl"
    });


    // STRUCTURES see structures.js
    $stateProvider.state('structuresres', {
        url: '/structuresres:search',
        templateUrl: 'partials/structuresres.html',
        controller: "structuresresCtl"
    });
    $stateProvider.state('struccompounds', {
        url: '/struccompounds:search',
        templateUrl: 'partials/compounds.html',
        controller: "struccompoundsCtl"
    });
    $stateProvider.state('structure', {
        url: '/structure',
        templateUrl: 'partials/structure.html',
        controller: "structureCtl"
    });



    //Operator Creator see creator.js
    $stateProvider.state('creator', {
        url: '/creator',
        templateUrl: 'partials/creator.html',
        controller: "creatorCtl"
    });

    $stateProvider.state('operator', {
        url: '/operator',
        templateUrl: 'partials/operator.html',
        controller: "operatorCtl"
    });
});

