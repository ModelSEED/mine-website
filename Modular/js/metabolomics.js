// Allows for communication between controllers note set up for test data
angular.module('app').factory('metabolomicsDataFactory', function($rootScope){
    var factory = {
        peaks:"",
        trace :  "164.0937301",
        model_term: "",
        filterKovats: false,
        kovats: [0, 20000],
        filterLogP: false,
        logP: [-35, 35],
        params: {
            tolerance: 3,
            ppm: false,
            charge: true,
            halogens: true,
            adducts: [],
            models: []
        },
        storeFormData: function($scope, $cookieStore) {
            factory.trace =$scope.trace;
            factory.params.tolerance = $scope.tolerance + + 0.000000000000001;
            factory.params.halogens = $scope.halogens;
            factory.params.ppm = $scope.ppm;
            factory.params.adducts = $scope.adducts;
            factory.filterKovats = $scope.filterKovats;
            factory.kovats = $scope.kovats;
            factory.filterLogP = $scope.filterLogP;
            factory.logP = $scope.logP;
            $cookieStore.put("charge: "+ $scope.charge, $scope.adducts);
        },
        mzSearch: function(db){
            //clone the parameters before passing them so we don't end up change in the factory object
            var params = jQuery.extend({}, factory.params);
            params.db = db;
            if (factory.filterLogP) {params.logP = factory.logP}
            if (factory.filterKovats) {params.kovats = factory.kovats}
            console.log(params);
            var promise = services.ms_adduct_search(factory.trace, "form", params);
            promise.then(function(result){
                    factory.hits = result;
                    $rootScope.$broadcast("metabolitesLoaded")
                },
                function(err){console.log("mzSearchFailure:"+err)}
            );
        },
        filterHits: function(list, mz, adduct, formula, compound, mine) {
            var filteredList = [];
            var patt = new RegExp(formula);
            for (var i = 0; i < list.length  ; i++) {
                if((list[i].peak_name.toString().indexOf(mz) > -1) &&
                    (list[i].adduct.toString().indexOf(adduct) > -1) &&
                    (patt.test(list[i].Formula.toString())) &&
                    (list[i].MINE_id.toString().indexOf(mine) > -1) &&
                    (!compound || (typeof(list[i].Names) != 'undefined') && (list[i].Names[0].indexOf(compound) > -1)))
                {filteredList.push(list[i])}
            }
            return filteredList
        }
    };
    return factory
});

angular.module('app').controller('metabolomicsCtl', function($scope,$state,$cookieStore,metabolomicsDataFactory,DbChoice){
    $scope.trace = metabolomicsDataFactory.trace;
    $scope.tolerance = parseInt(metabolomicsDataFactory.params.tolerance);
    $scope.charge = metabolomicsDataFactory.params.charge;
    $scope.halogens = metabolomicsDataFactory.params.halogens;
    $scope.ppm = metabolomicsDataFactory.params.ppm;
    $scope.filterLogP = metabolomicsDataFactory.filterLogP;
    $scope.logP = metabolomicsDataFactory.logP;
    $scope.filterKovats = metabolomicsDataFactory.filterKovats;
    $scope.kovats = metabolomicsDataFactory.kovats;
    $scope.adducts = [];
    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    DbChoice.where = "";
    $scope.$watch('charge', function() {
        metabolomicsDataFactory.params.charge = $scope.charge;
        var promise = services.get_adducts();
        promise.then(function(result){
                if ($scope.charge) {$scope.adduct_list = result[0];}
                else {$scope.adduct_list = result[1]}
                var adducts = $cookieStore.get("charge: "+ $scope.charge);
                console.log(adducts);
                if( typeof(adducts) == 'object') {
                    $scope.adducts = adducts
                }
                else {$scope.adducts =[];}
                $scope.$apply();
            },
            function(err){
                console.log("metabolomicsCtl fail");
            }
        );
    });
    $scope.metSearch = function() {
        metabolomicsDataFactory.storeFormData($scope, $cookieStore);
        $state.go("metabolomicsCompounds")
    };

    $scope.$watch('adducts', function() {
        if ($scope.adducts.length > 0) {
           $scope.enable = false;
        }
     });
});

angular.module('app').controller('metabolomicsCompoundsCtl', function($scope,metabolomicsDataFactory,sharedFactory,DbChoice){
    $scope.currentPage = 1;
    $scope.numPerPage = 25;
    $scope.maxSize = 5;
    $scope.items = 0;
    $scope.searchMZ = "";
    $scope.searchAdduct = "";
    $scope.searchFormula = "";
    $scope.searchCompound = "";
    $scope.searchMINE = "";
    $scope.sortColumn = 'steps_from_source';
    $scope.sortInvert = true;
    $scope.img_src = sharedFactory.img_src;
    $scope.selectedModels = metabolomicsDataFactory.metaModels;
    DbChoice.where = "metabolomics";
    var filteredData = [];
    metabolomicsDataFactory.mzSearch(DbChoice.dbid);
    $scope.$on("metabolitesLoaded", function () {
        filteredData = metabolomicsDataFactory.filterHits(metabolomicsDataFactory.hits, $scope.searchMZ,
            $scope.searchAdduct, $scope.searchFormula, $scope.searchCompound, $scope.searchMINE);
        filteredData = sharedFactory.sortList(filteredData,$scope.sortColumn,$scope.sortInvert);
        $scope.displayData = sharedFactory.paginateList(filteredData, $scope.currentPage, $scope.numPerPage);
        $scope.items = filteredData.length;
        $scope.totalItems = metabolomicsDataFactory.hits.length;
        $scope.$apply();
    });

    $scope.colour = function(native,steps){
        // If native_hit is true, make it green
        if(native == true){return "#428bca"}
        return "#000000";
    };

    $scope.downloadResults = function(){
        var jsonObject = JSON.stringify(filteredData);
        var exclude = {"$$hashKey":"", 'id':""};
        var csv = sharedFactory.convertToCSV(jsonObject, exclude);
        var d = new Date();
        sharedFactory.downloadFile(csv, d.toISOString()+'.csv');
    };

    $scope.$watch('searchMINE + searchMZ + searchAdduct + searchFormula + searchCompound', function() {
        if (metabolomicsDataFactory.hits) {
            filteredData = metabolomicsDataFactory.filterHits(metabolomicsDataFactory.hits, $scope.searchMZ,
                $scope.searchAdduct, $scope.searchFormula, $scope.searchCompound, $scope.searchMINE);
            filteredData = sharedFactory.sortList(filteredData, $scope.sortColumn, $scope.sortInvert);
            $scope.displayData = sharedFactory.paginateList(filteredData, $scope.currentPage, $scope.numPerPage)
        }
    });

    $scope.$watch('sortColumn + sortInvert', function(){
        filteredData = sharedFactory.sortList(filteredData,$scope.sortColumn,$scope.sortInvert);
        $scope.displayData = sharedFactory.paginateList(filteredData, $scope.currentPage, $scope.numPerPage)
    });

    $scope.$watch('currentPage', function(){
        $scope.displayData = sharedFactory.paginateList(filteredData, $scope.currentPage, $scope.numPerPage)
    });
});