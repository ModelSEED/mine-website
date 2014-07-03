angular.module('app',['ui.router','ui.bootstrap']);


// default contoler on the mine quick search is in quicksearch.js

angular.module('app').config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    //HOME
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'partials/home.html'
    });
    //ABOUT
    $stateProvider.state('about', {
        url: '/about',
        templateUrl: 'partials/about.html'
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
        templateUrl: 'partials/overview.html'    
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
        url: '/metablomicsCompounds',
        templateUrl: 'partials/list.html',
        controller: "metablomicsCompoundsCtl" 
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
    

    //KEGG see kegg.js
    $stateProvider.state('kegg', {
        url: '/kegg',
        templateUrl: 'partials/kegg.html'
    }); 

    
});


