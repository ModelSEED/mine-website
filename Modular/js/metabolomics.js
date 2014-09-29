// Allows for communication between controllers note set up for test data
angular.module('app').factory('metabolomicsDataFactory',function(){
    return{
        trace :  "164.0937301",
        tolerance : 3,
        unit : false,
        charges :  [
        {name:'Positive',id:0},
        {name:'Negative',id:1}],
        charge : 'Positive',
        halogenated : true,
        adducts: [],
        model: "",
        metaModels:[]
    }
});

angular.module('app').controller('metabolomicsCtl', function($scope,$cookies,$cookieStore,metabolomicsDataFactory){
    $scope.trace = metabolomicsDataFactory.trace;
    $scope.tolerance =metabolomicsDataFactory.tolerance;
    $scope.charges =  metabolomicsDataFactory.charges;
    $scope.charge=$scope.charges[0];
    $scope.halogenated = metabolomicsDataFactory.halogenated;
    $scope.unit = metabolomicsDataFactory.unit;
    $scope.enable = true;
    $scope.adducts =[];

    console.log("metabolomicsCtl");
    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    var promise = services.get_adducts();
    promise.then(function(result){
            $scope.adduct = result;
            var adducts = $cookieStore.get($scope.charge.name);
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
    $scope.$watch('charge', function() {
        metabolomicsDataFactory.charge = $scope.charge.name;
        var adducts = $cookieStore.get($scope.charge.name);
        console.log(adducts);
        if( typeof(adducts) == 'object') {
            $scope.adducts = adducts
        }
        else {$scope.adducts =[];}
    });

    $scope.$watch('trace + tolerance + halogenated + adducts + unit', function() {
        metabolomicsDataFactory.trace =$scope.trace;
        metabolomicsDataFactory.tolerance = $scope.tolerance;
        metabolomicsDataFactory.charges = $scope.charges;
        metabolomicsDataFactory.charge = $scope.charge.name;
        metabolomicsDataFactory.halogenated = $scope.halogenated;
        metabolomicsDataFactory.unit = $scope.unit;
        metabolomicsDataFactory.adducts = $scope.adducts;
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
    $scope.selectedModels = metabolomicsDataFactory.metaModels;

    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    var test_db = DbChoice.dbid;
    $cookieStore.put(metabolomicsDataFactory.charge, metabolomicsDataFactory.adducts);
    var charge = (metabolomicsDataFactory.charge == "Positive");
    var precision =  metabolomicsDataFactory.tolerance + 1.000000000000001; // revert to int problem work around
    console.log(metabolomicsDataFactory.metaModels);
    promise = services.batch_ms_adduct_search(test_db, metabolomicsDataFactory.trace, "form", precision, metabolomicsDataFactory.adducts, metabolomicsDataFactory.metaModels, metabolomicsDataFactory.unit, charge, metabolomicsDataFactory.halogenated);
    DbChoice.where = "metabolomics";
    promise.then(function(result){
            $scope.peaks = result;
            $scope.totalItems = countData("","","","","");
            $scope.items = $scope.totalItems;
            //$scope.numPages = Math.ceil($scope.totalItems/ $scope.numPerPage)
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
        var jsonObject = JSON.stringify($scope.filteredData);
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


    $scope.$watch('currentPage + peaks + items + searchMINE + searchMZ + searchAdduct + searchFormula + searchCompound', function() {
        if((typeof($scope.peaks) != 'undefined') &&($scope.peaks.length > 0)){
            /*$scope.totalItems = countData($scope.searchMINE,$scope.searchMZ,$scope.searchAdduct,$scope.searchCompound,$scope.searchFormula);
            $scope.begin = (($scope.currentPage - 1) * $scope.numPerPage);
            $scope.end = $scope.begin + $scope.numPerPage;
            if ($scope.end > $scope.totalItems) {
                $scope.end = $scope.totalItems
            }*/
            $scope.filteredData = [];
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
                                $scope.filteredData.push({MZ:$scope.peaks[i].name,
                                    id:$scope.peaks[i].adducts[j].isomers[k]._id,
                                    adduct:$scope.peaks[i].adducts[j].adduct,formula:$scope.peaks[i].adducts[j].formula,
                                    MINE_id:$scope.peaks[i].adducts[j].isomers[k].MINE_id, name:fname,
                                    smiles:$scope.peaks[i].adducts[j].isomers[k].SMILES,
                                    inchikey:$scope.peaks[i].adducts[j].isomers[k].Inchikey,
                                    native_hit:$scope.peaks[i].adducts[j].isomers[k].native_hit,
                                    steps_from_source:$scope.peaks[i].adducts[j].isomers[k].steps_from_source})
                        }
                    }
                }
            }
            $scope.filteredData.sort(function(a,b){return a.steps_from_source-b.steps_from_source});
        }
    });
});

