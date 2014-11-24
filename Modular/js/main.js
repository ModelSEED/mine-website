angular.module('app',['ui.router','ui.bootstrap','ngCookies', 'ngJoyRide', 'ui-rangeSlider']);
angular.module('app').factory('sharedFactory', function(){
    var factory = {
        img_src: "http://lincolnpark.chem-eng.northwestern.edu/Smiles_dump/",
        downloadFile: function (contents,filename) {
            var link = document.createElement('a');
            link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents));
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        convertToCSV: function(objArray, exclude) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var out = '';
            for (var key in array[0]) {
                if (!(key in exclude)){
                    if (out != '') out += ',';
                    out += '"'+key+'"';
                }
            }
            out += '\r\n';
            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (key in array[i]) {
                    if (!(key in exclude)){
                        if (line != '') line += ',';
                        line += '"'+array[i][key]+'"';
                    }
                }
                out += line + '\r\n';
            }
            return out;
        },
        paginateList: function(list, currentPage, numPerPage){
            var begin = ((currentPage - 1) * numPerPage);
            var end = begin + numPerPage;
            return list.slice(begin, end);
        },
        sortList: function(list, attribute, ascending){
            list.sort(function(a,b){
                if (ascending){return a[attribute]-b[attribute]}
                else{return b[attribute]-a[attribute]}
            });
            return list
        }
    };
    return factory
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

// default controller on the mine quick search is in quicksearch.js

angular.module('app').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');
    //HOME
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'partials/home.html',
        controller: "resetCtl"
    });
    //FAQ
    $stateProvider.state('faq', {
        url: '/faq',
        templateUrl: 'partials/FAQ.html',
        controller: "resetCtl"
    });

    // COMPOUNDS QUICK SEARCH see textSearch.js
    $stateProvider.state('compounds', {
        url: '/compounds:search',
        templateUrl: 'partials/compoundslist.html',
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
        controller: "resetCtl"
    });
    $stateProvider.state('acompound.reactants', {
        url: '/reactantIn',
        templateUrl: 'partials/reactions.html',
        controller: "reactantInCtl"
    });
    $stateProvider.state('acompound.products', {
        url: '/productOf',
        templateUrl: 'partials/reactions.html',
        controller: "productOfCtl"
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
        templateUrl: 'partials/compoundslist.html',
        controller: "structuresresCtl"
    });
    $stateProvider.state('structure', {
        url: '/structure',
        templateUrl: 'partials/structureSearch.html',
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