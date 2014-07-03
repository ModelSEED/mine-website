// Allows for communication between controlers
angular.module('app').factory('CompoundDataFactory', function(){
    return {compound:{}};
});

angular.module('app').controller('acompoundCtl', function($scope,$stateParams,DbChoice,CompoundDataFactory){
    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    var test_db = DbChoice.dbid;
    $scope.search = $stateParams.id;
    $scope.data = CompoundDataFactory.compound;
    promise = services.get_comps(test_db, [$scope.search]);
    promise.then(
        function(result){
            //console.log(result[0]);
            $scope.data = result[0];
            CompoundDataFactory.compound = $scope.data;  // sets commmon data
            $scope.$apply();
        },
        function(err){
            console.log("acompoundCtl fail");
            $scope.data =[];
            $scope.$apply();
        }
    );
});

angular.module('app').controller('productsCtl', function($scope,$stateParams,DbChoice,CompoundDataFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.items=0;
    $scope.numPages =0;


    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    var test_db = DbChoice.dbid;
    promise = services.get_rxns(test_db,CompoundDataFactory.compound.Product_of);
    promise.then(function(result){
            $scope.products = result;
            $scope.items = result.length
            $scope.totalItems = $scope.products.length;
            $scope.numPages = Math.ceil($scope.products.length / $scope.numPerPage)
            $scope.$apply();
        },
        function(err){
            console.log("productsCtl fail");
            $scope.products =[];
            $scope.$apply();
        }
    );


    $scope.$watch('currentPage + products + items', function() {
        if((typeof($scope.products) != 'undefined') &&($scope.products.length > 0)){
            $scope.numPages = Math.ceil($scope.products.length / $scope.numPerPage)
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;
            $scope.filteredData = $scope.products.slice(begin, end);
        }
    });
});


angular.module('app').controller('reactantsCtl', function($scope,$stateParams,DbChoice,CompoundDataFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.items=0;
    $scope.numPages =0;
    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    var test_db = DbChoice.dbid;
    promise = services.get_rxns(test_db,CompoundDataFactory.compound.Reactant_in);
    promise.then(function(result){
            $scope.reactants = result;
            $scope.totalItems = $scope.reactants.length;
            $scope.numPages = Math.ceil($scope.reactants.length / $scope.numPerPage)
            $scope.$apply();
        },
        function(err){
            console.log("reactantsCtl fail");
            $scope.reactants =[];
            $scope.$apply();
        }
    );

    $scope.$watch('currentPage + reactants + items', function() {
        if((typeof($scope.reactants) != 'undefined') &&($scope.reactants.length > 0)){
            $scope.numPages = Math.ceil($scope.reactants.length / $scope.numPerPage)
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;
            $scope.filteredData = $scope.reactants.slice(begin, end);
        }
    });
});