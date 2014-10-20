// Allows for communication between controllers note set up for test data
angular.module('app').factory('metabolomicsDataFactory',function(){
    return{
        trace :  "164.0937301",
        model_term: "",
        filterKovats: false,
        kovats: [0, 20000],
        filterLogP: false,
        logP: [-35, 35],
        params:{
            tolerance : 3,
            ppm : false,
            charge : true,
            halogens : true,
            adducts: [],
            models:[]
        }
    }
});

angular.module('app').controller('metabolomicsCtl', function($scope,$cookies,$cookieStore,metabolomicsDataFactory, DbChoice){
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

    $scope.$watch('trace + tolerance + halogenated + adducts + ppm + filterKovats + kovats + filterLogP +logP', function() {
        metabolomicsDataFactory.trace =$scope.trace;
        metabolomicsDataFactory.params.tolerance = $scope.tolerance + + 0.000000000000001;
        metabolomicsDataFactory.params.halogens = $scope.halogens;
        metabolomicsDataFactory.params.ppm = $scope.ppm;
        metabolomicsDataFactory.params.adducts = $scope.adducts;
        metabolomicsDataFactory.filterKovats = $scope.filterKovats;
        metabolomicsDataFactory.kovats = $scope.kovats;
        metabolomicsDataFactory.filterLogP = $scope.filterLogP;
        metabolomicsDataFactory.logP = $scope.logP;
        if ($scope.adducts.length > 0) {
           $scope.enable = false;
        }
     });
});

angular.module('app').controller('metabolomicsCompoundsCtl', function($scope,$cookieStore,metabolomicsDataFactory,DbChoice){

    $scope.currentPage = 1;
    $scope.numPerPage = 25;
    $scope.maxSize = 5;
    $scope.items=0;
    $scope.filteredData = [];
    $scope.totalItems = 0;
    $scope.searchMINE = "";
    $scope.searchMZ = "";
    $scope.searchAdduct = "";
    $scope.searchFormula = "";
    $scope.searchCompound = "";
    $scope.begin=0;
    $scope.end=0;
    $scope.sortColumn = 'steps_from_source';
    $scope.sortInvert = true;
    $scope.selectedModels = metabolomicsDataFactory.metaModels;
    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    $cookieStore.put("charge: "+ metabolomicsDataFactory.params.charge, metabolomicsDataFactory.params.adducts);
    var params = jQuery.extend({}, metabolomicsDataFactory.params);
    params.db = DbChoice.dbid;
    if (metabolomicsDataFactory.filterLogP) {params.logP = metabolomicsDataFactory.logP}
    if (metabolomicsDataFactory.filterKovats) {params.kovats = metabolomicsDataFactory.kovats}
    console.log(params);
    var promise = services.mz_search(metabolomicsDataFactory.trace, "form", params);
    DbChoice.where = "metabolomics";
    promise.then(function(result){
            $scope.peaks = result;
            $scope.totalItems = countData("","","","","");
            $scope.items = $scope.totalItems;
            $scope.$apply();
        },
        function(err){
            console.log("metabolomicsCompoundsCtl fail");
            $scope.reactants =[];
            $scope.$apply();
        }
    );
    $scope.colour = function(native,steps){
        // If native_hit is true, make it green if
        //min_steps is 0 make it lighter green
        if(native == true){
            return "#428bca";
        }
        /*if (typeof steps == "number"){
            if (steps ==0){
                return "#84C884";
            }
        }*/
        return "#000000";
    };

    $scope.downloadResults = function(){
        var jsonObject = JSON.stringify(filteredData);
        var exclude = {"$$hashKey":"", 'id':""};
        var csv = ConvertToCSV(jsonObject, exclude);
        var d = new Date();
        downloadFile(csv, d.toISOString()+'.csv');
    };

    function ConvertToCSV(objArray, exclude) {
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
    }

    var countData = function(id,mz,adduct,compound,formula){
        var c = 0;
        for (var i = 0; i < $scope.peaks.length   ; i++) {
            for (var j = 0; j < $scope.peaks[i].adducts.length; j++) {
                for(var k = 0; k<$scope.peaks[i].adducts[j].isomers.length ;k++ ){
                    var fname = "";
                    if(typeof($scope.peaks[i].adducts[j].isomers[k].Names) != 'undefined'){
                        fname = $scope.peaks[i].adducts[j].isomers[k].Names[0];
                    }
                    if(($scope.peaks[i].name.toString().indexOf($scope.searchMZ) > -1)
                        &&
                        ($scope.peaks[i].adducts[j].adduct.toString().indexOf(adduct) > -1)
                        &&
                        ($scope.peaks[i].adducts[j].formula.toString().indexOf(formula) > -1)
                        &&
                        (fname.toString().indexOf(compound) > -1)
                        &&
                        ($scope.peaks[i].adducts[j].isomers[k].MINE_id.toString().indexOf(id) > -1)
                    ){
                       c++; 
                    }
                }
            }
        }
        return c;
    };


    $scope.$watch('currentPage + peaks + items + searchMINE + searchMZ + searchAdduct + searchFormula + searchCompound + sortColumn + sortInvert', function() {
        if((typeof($scope.peaks) != 'undefined') &&($scope.peaks.length > 0)){
            $scope.totalItems = countData($scope.searchMINE,$scope.searchMZ,$scope.searchAdduct,$scope.searchCompound,$scope.searchFormula);
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;
            if (end > $scope.totalItems) {
                end = $scope.totalItems
            }
            filteredData = [];
            for (var i = 0; i < $scope.peaks.length  ; i++) {
                for (var j = 0; j < $scope.peaks[i].adducts.length; j++) {
                    for(var k = 0; k<$scope.peaks[i].adducts[j].isomers.length ;k++ ){
                        var fname = "";
                        if(typeof($scope.peaks[i].adducts[j].isomers[k].Names) != 'undefined'){
                           fname = $scope.peaks[i].adducts[j].isomers[k].Names[0];
                        }
                        var patt = new RegExp($scope.searchFormula);
                        if(
                            ($scope.peaks[i].name.toString().indexOf($scope.searchMZ) > -1)
                            &&
                            ($scope.peaks[i].adducts[j].adduct.toString().indexOf($scope.searchAdduct) > -1)
                            &&
                            (patt.test($scope.peaks[i].adducts[j].formula.toString()))
                            &&
                            (fname.toString().indexOf($scope.searchCompound) > -1)
                            &&
                            ($scope.peaks[i].adducts[j].isomers[k].MINE_id.toString().indexOf($scope.searchMINE) > -1)
                            ){
                            filteredData.push({MZ:$scope.peaks[i].name,
                                    id:$scope.peaks[i].adducts[j].isomers[k]._id,
                                    adduct:$scope.peaks[i].adducts[j].adduct,formula:$scope.peaks[i].adducts[j].formula,
                                    MINE_id:$scope.peaks[i].adducts[j].isomers[k].MINE_id, name:fname,
                                    smiles:$scope.peaks[i].adducts[j].isomers[k].SMILES,
                                    inchikey:$scope.peaks[i].adducts[j].isomers[k].Inchikey,
                                    native_hit:$scope.peaks[i].adducts[j].isomers[k].native_hit,
                                    steps_from_source:$scope.peaks[i].adducts[j].isomers[k].steps_from_source,
                                    logP:$scope.peaks[i].adducts[j].isomers[k].logP,
                                    minKovatsRI:$scope.peaks[i].adducts[j].isomers[k].minKovatsRI,
                                    maxKovatsRI:$scope.peaks[i].adducts[j].isomers[k].maxKovatsRI,
                                    npLikeness:$scope.peaks[i].adducts[j].isomers[k].NP_likeness})
                        }
                    }
                }
            }
            filteredData.sort(function(a,b){
                if ($scope.sortInvert){
                    return a[$scope.sortColumn]-b[$scope.sortColumn]
                }
                else{
                    return b[$scope.sortColumn]-a[$scope.sortColumn]
                }
            });
            $scope.displayData = filteredData.slice(begin, end)

        }
    });
});

