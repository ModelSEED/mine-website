// Allows for communication between controllers note set up for test data
angular.module('app').factory('metabolomicsDataFactory', function($rootScope){
    var factory = {
        services: new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database'),
        trace :  "164.0937301",
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
        storeFormData: function($scope, $cookieStore) { // updates factory and cookies on search
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
            var promise = factory.services.ms_adduct_search(factory.trace, "form", params);
            promise.then(function(result){
                    factory.hits = result;
                    $rootScope.$broadcast("metabolitesLoaded")
                },
                function(err){console.log(err)}
            );
        },
        filterHits: function(list, mz, adduct, formula, compound, mine) {
            // filtering but we have to handle names carefully (sometimes not present) and use RegEx with formula
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

angular.module('app').controller('metabolomicsCtl', function($scope,$state,$cookieStore,shareFactory, metabolomicsDataFactory){
    $scope.trace = metabolomicsDataFactory.trace;
    $scope.tolerance = parseInt(metabolomicsDataFactory.params.tolerance);
    $scope.halogens = metabolomicsDataFactory.params.halogens;
    $scope.ppm = metabolomicsDataFactory.params.ppm;
    $scope.filterLogP = metabolomicsDataFactory.filterLogP;
    $scope.logP = metabolomicsDataFactory.logP;
    $scope.filterKovats = metabolomicsDataFactory.filterKovats;
    $scope.kovats = metabolomicsDataFactory.kovats;
    $scope.adducts = [];
    var adductList;

    metabolomicsDataFactory.services.get_adducts().then(
        function(result){
            adductList = result;
            $scope.charge = metabolomicsDataFactory.params.charge; // triggers following watch statement
            $scope.$apply();
        },
        function(err) {console.log(err)}
    );

    $scope.$watch('charge', function() { // if the charge changes, update the adduct list while checking the cookies
        if (adductList) {
            metabolomicsDataFactory.params.charge = $scope.charge;
            if ($scope.charge) {$scope.adduct_list = adductList[0];}
            else {$scope.adduct_list = adductList[1]}
            var adducts = $cookieStore.get("charge: "+ $scope.charge);
            if (typeof(adducts) == 'object') $scope.adducts = adducts;
            else $scope.adducts = [];
        }
    });

    $scope.metSearch = function() {
        metabolomicsDataFactory.params.models = sharedFactory.c_selected_models
        metabolomicsDataFactory.storeFormData($scope, $cookieStore);
        $state.go("metabolomicsCompounds")
    };
});

angular.module('app').controller('metabolomicsCompoundsCtl', function($scope,$state,metabolomicsDataFactory,sharedFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = sharedFactory.numPerPage;
    $scope.maxSize = 5;
    $scope.items = -1;
    $scope.searchMZ = "";
    $scope.searchAdduct = "";
    $scope.searchFormula = "";
    $scope.searchCompound = "";
    $scope.searchMINE = "";
    $scope.sortColumn = 'Generation';
    $scope.sortInvert = true;
    $scope.img_src = sharedFactory.img_src;
    $scope.selectedModels = metabolomicsDataFactory.metaModels;
    var filteredData = [];

    // if we get here w/o parameters (ie direct link), return to the search screen
    if (!metabolomicsDataFactory.params.adducts.length) $state.go('metabolomics');
    else metabolomicsDataFactory.mzSearch(sharedFactory.dbId);

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
            $scope.items = filteredData.length;
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