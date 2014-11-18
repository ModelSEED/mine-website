angular.module('app',['ui.router','ui.bootstrap','ngCookies', 'ngJoyRide', 'ui-rangeSlider']);
angular.module('app').factory('currentState', function(){
    return 'home';
});

angular.module('app').filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

angular.module('app').controller('cookieCtl',function($scope,$cookies,$cookieStore) {
    $scope.startGeneralTour = function () {
        var tour = new Tour(generalTour());
        tour.init();
        tour.start();
    };

    var visited = $cookieStore.get('mine');
    if( typeof(visited) == 'undefined') {
        $cookieStore.put('mine', "mine_visitor");
        $scope.startGeneralTour()
    }
});

// default contoler on the mine quick search is in quicksearch.js

angular.module('app').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');
    //HOME
    $stateProvider.state('home', {
        url: '/home',
        views: {
            '':{
                templateUrl: 'partials/home.html',
                contoler: "resetCtl"
            }
        }
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


    //METABLOMICS see metabolomics.js
    $stateProvider.state('metabolomics', {
        
        url: '/metabolomics',
        views: {
            '':{
                templateUrl: 'partials/metabolomics.html',
                controller: "metabolomicsCtl"
            },            
            'sidebar':{
                templateUrl: 'partials/models.html',
                controller: "modelsCtl"
            }
        }
    });

    $stateProvider.state('metabolomicsCompounds', {
      url: '/metabolomicsCompounds:search',
      views: {
            '':{
                templateUrl: 'partials/metaboliteslist.html',
                controller: "metabolomicsCompoundsCtl"
                },
            'sidebar':{
                templateUrl: 'partials/models.html',
                controller: "modelsCtl"
            }
        }
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
img_src = "http://lincolnpark.chem-eng.northwestern.edu/Smiles_dump/";
services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');

function downloadFile(contents,filename) {
    var link = document.createElement('a');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}