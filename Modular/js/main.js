angular.module('app',['ui.router','ui.bootstrap','ngCookies', 'ngJoyRide', 'ui-rangeSlider', 'angulartics', 'angulartics.google.analytics']);
angular.module('app').factory('sharedFactory', function(){
    var factory = {
        dbId:'KEGGexp2',
        //if the db changes in one of these states, reload the page
        db_dependent_states: ['compounds', 'metabolomicsCompounds', 'structuresres', 'operator', 'acompound.reactants',
            'acompound.products', 'acompound.overview'],
        img_src: "http://lincolnpark.chem-eng.northwestern.edu/Smiles_dump/",
        services: new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database'),
        numPerPage: 25, // default number of results to show per page
        downloadFile: function (contents,filename) {
            // Warning: This function may not work with IE!
            var link = document.createElement('a');
            link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents));
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        convertToCSV: function(objArray, exclude) {
            // This gets the keys from the first object in the array which may cause problems if the objects have
            // variable attributes. If the attribute is not in the first object, it won't ever be included
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
                for (key in array[0]) {
                    if (!(key in exclude)){
                        if (line != '') line += ',';
                        if (key in array[i]) line += '"' + array[i][key] + '"';
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
        filterList: function(reactions, field, searchOn) {
            if (searchOn && (typeof(reactions) != 'undefined') && (reactions.length > 0)) {
                var subList = [];
                for (var i = reactions.length - 1; i >= 0; i--) {
                    if ((reactions[i][field].toLowerCase().indexOf(searchOn.toLowerCase()) > -1)&&(subList[subList.length-1] != reactions[i])) {
                        subList.push(reactions[i]);
                    }
                }
                return subList
            }
            else{return reactions}
        },
        sortList: function(list, attribute, ascending){
            list.sort(function(a,b){
                if (ascending){
                    if (a[attribute]==null) return 1;
                    if (b[attribute]==null) return 0;
                    return a[attribute]-b[attribute]
                }
                else{
                    if (a[attribute]==null) return 1;
                    if (b[attribute]==null) return 0;
                    return b[attribute]-a[attribute]
                }
            });
            return list
        }
    };
    return factory
});
if (navigator.userAgent.indexOf('MSIE') > 0 || navigator.appVersion.indexOf('Trident/') > 0) {
   alert("This web application does not officially support Internet Explorer and some elements may not render or " +
       "function correctly in this environment. For best performance, utilize the Chrome browser.")
}
angular.module('app').controller('cookieCtl',function($scope,$cookieStore) {
    $scope.startGeneralTour = function () {
        var tour = new Tour(generalTour());
        tour.init();
        tour.start();
    };

    $scope.startMetabolomicsTour = function () {
        var tour = new Tour(metabolomicsTour());
        tour.init();
        tour.start();
    };

    var visited = $cookieStore.get('mine');
    if( typeof(visited) == 'undefined') {
        $cookieStore.put('mine', "mine_visitor");
        //$scope.startGeneralTour()
    }
});

angular.module('app').controller('databaseCtl',  function ($scope,$state,sharedFactory,$cookieStore) {
    $scope.databases =  [
        {id:0, name:'KEGG',  db :'KEGGexp2'},
        {id:1, name:'EcoCyc', db : 'EcoCycexp2'},
        {id:2, name:'YMDB', db : 'YMDBexp2'},
        {id:3, name:'Chemical Damage SEED', db : 'CDMINE'}
    ];
    var database_id = $cookieStore.get('mine_db');
    if( typeof(database_id) == 'undefined') {$scope.database = $scope.databases[0]}
    else {$scope.database = $scope.databases[database_id]}
    sharedFactory.dbId = $scope.database.db;

    $scope.$on("CDMINE", function () {$scope.database = $scope.databases[3]});

    $scope.$watch('database', function() {
        // This tracks which database is selected and reloads the page if it's content depends on the database
        var state_name = $state.current.name;
        sharedFactory.dbId = $scope.database.db;
        $cookieStore.put('mine_db', $scope.database.id);
        if (sharedFactory.db_dependent_states.indexOf(state_name) > -1) $state.go($state.current,{},{reload:true});
    });

});

angular.module('app').directive('reactionDiagram', function(){
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        templateUrl: 'partials/reaction-diagram.html'
    }
});

angular.module('app').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');
    //HOME
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'partials/home.html',
        controller: "cookieCtl"
    });
    //FAQ
    $stateProvider.state('faq', {
        url: '/faq',
        templateUrl: 'partials/FAQ.html',
        controller: "cookieCtl"
    });

    // COMPOUNDS QUICK SEARCH see textSearch.js
    $stateProvider.state('compounds', {
        url: '/compounds:search',
        templateUrl: 'partials/compoundslist.html',
        controller: "compoundsCtl"
    });
    $stateProvider.state('advancedsearch', {
        url: '/advancedsearch',
        templateUrl: 'partials/advancedsearch.html',
        controller: "advancedSearchCtl"
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
        controller: "acompoundCtl"
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

    $stateProvider.state('operator', {
        url: '/operator:id',
        templateUrl: 'partials/operator.html',
        controller: "operatorCtl"
    });


    //METABOLOMICS see metabolomics.js
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

    //Top 30 damage prone metabolites reaction list
    $stateProvider.state('top30', {
        url: '/top30',
        templateUrl: 'partials/top30.html',
        controller: "cookieCtl"
    });
    $stateProvider.state('top30.s1', {
        url: '/S1:id',
        templateUrl: 'partials/S1.html',
        controller: "s1Ctl"
    });
    $stateProvider.state('top30.s2', {
        url: '/S2',
        templateUrl: 'partials/S2.html',
        controller: "s2Ctl"
    });


    //Operator Creator see creator.js
    $stateProvider.state('creator', {
        url: '/creator',
        templateUrl: 'partials/creator.html',
        controller: "opCreatorCtl"
    });
    $stateProvider.state('optest', {
        url: '/test',
        templateUrl: 'partials/optest.html',
        controller: "opTestCtl"
    });
});