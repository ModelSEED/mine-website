// Allows for communication between controlers note set up for test data
angular.module('app').factory('metablomicsDataFactory',function(){
    return{
        trace :  "164.0937301\n0.0", //moverz
        tolerance : 3,
        unit : false,
        charges :  [
        {name:'Positive',id:0},
        {name:'Negative',id:1},
        {name:'None',id:0}],
        charge : 'Positive',
        halogenated : true,
        statuses: []
    }
});

angular.module('app').controller('metablomicsCtl', function($scope,metablomicsDataFactory,DbChoice){
    $scope.trace = metablomicsDataFactory.trace;
    $scope.tolerance =metablomicsDataFactory.tolerance;
    $scope.charges =  metablomicsDataFactory.charges;
    $scope.charge=$scope.charges[0];
    $scope.halogenated = metablomicsDataFactory.halogenated;
    $scope.unit = metablomicsDataFactory.unit
    $scope.enable = true;
    $scope.statuses =[];

    console.log("metablomicsCtl");
    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    promise = services.get_adducts();
    promise.then(function(result){
            $scope.adduct = result;
            $scope.statuses = [];
            $scope.$apply();

        },
        function(err){
            console.log("metablomicsCtl fail");
        }
    );

    $scope.$watch('trace + tolerance + charges + halogenated + statuses + unit', function() {
        metablomicsDataFactory.trace =$scope.trace;
        metablomicsDataFactory.tolerance = $scope.tolerance;
        metablomicsDataFactory.charges = $scope.charges;
        metablomicsDataFactory.charge = $scope.charge.name;
        metablomicsDataFactory.halogenated = $scope.halogenated;
        metablomicsDataFactory.unit = $scope.unit;
        metablomicsDataFactory.statuses = $scope.statuses;
        if ($scope.statuses.length > 0) {
           $scope.enable = false;
          }

     });

})

angular.module('app').controller('metablomicsCompoundsCtl', function($scope,metablomicsDataFactory,DbChoice){

    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.items=0;
    $scope.numPages =0;

    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    var test_db = DbChoice.dbid;
    var charge = (metablomicsDataFactory.charge == "Positive");
    var precision =  metablomicsDataFactory.tolerance + 1.000000000000001; // revert to int problem work around
    promise = services.batch_ms_adduct_search(test_db, metablomicsDataFactory.trace, "form", precision,metablomicsDataFactory.statuses, [], metablomicsDataFactory.unit, charge, metablomicsDataFactory.halogenated);
    DbChoice.where = "metablomics";
    promise.then(function(result){
            console.log(result);
            $scope.peaks = result;
            $scope.totalItems = $scope.peaks.length;
            $scope.numPages = Math.ceil($scope.peaks.length / $scope.numPerPage)
            console.log("metablomicsCtl success");
            $scope.$apply();
        },
        function(err){
            console.log("metablomicsCompoundsCtl fail");
            $scope.reactants =[];
            $scope.$apply();
        }
    );
    $scope.colour = function(native,steps){
        // If native_hit is true, make it green if
        //min_steps is 0 make it lighter green
        if(native == true){
            return "#008000";
        }
        if (typeof steps == "number"){
            if (steps ==0){
                return "#84C884";
            }
        }
        else{
            for (i = 0; i < steps.length; i++){
                if (steps[i].steps_from_source == 0){
                    return "#84C884";
                }
            }
        }
        return "#000000";
    };
    
    $scope.$watch('currentPage + peaks + items', function() {
        if((typeof($scope.peaks) != 'undefined') &&($scope.peaks.length > 0)){
            $scope.numPages = Math.ceil($scope.peaks.length / $scope.numPerPage)
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;
            $scope.filteredData = $scope.peaks.slice(begin, end);
        }
    });
})
