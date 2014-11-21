angular.module('app').controller('quickSearchCtl',  function ($scope,$state,DbChoice,currentState) {
    $scope.doQuickSearch = function(ev) {
        if (!ev || ev.which==13){
            DbChoice.quickSearch = $scope.name;
            currentState = 'quick';
            DbChoice.where = 'quick';
            $state.go("compounds",{search:$scope.name+','+DbChoice.dbid.db});
        }
    }
});

angular.module('app').controller('compoundsCtl', function($scope,$stateParams,DbChoice){
    $scope.currentPage = 1;
    $scope.numPerPage = 25;
    $scope.maxSize = 5;
    $scope.items=0;
    $scope.data=[];
    $scope.numPages =0;



    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    $scope.test_db = DbChoice.dbid;
    var srch = $stateParams.search.split(",");
    $scope.search = srch[0];

    $scope.formatNames = function(nameArray) {
        if (nameArray.length < 6) {
            return nameArray.join('\n')
        }
        else {
            return nameArray.slice(0,5).join('\n') + "\n..."
        }
    };

    var promise = services.quick_search($scope.test_db, $scope.search);
    promise.then(
            function(result){
                if(result.length >1){
                    $scope.items = result.length+ " items found";
                }else{
                    $scope.items = result.length+ " item found";
                }
                $scope.data = result;
                $scope.totalItems = $scope.data.length;
                $scope.numPages = Math.ceil($scope.data.length / $scope.numPerPage)
                $scope.$apply();
            },
            function(err){
                $scope.items = "0 items found";
                $scope.data = [];
                $scope.$apply();
            }
    );


    $scope.$watch('$scope.test_db + currentPage + items', function() {
        console.log($scope.test_db);
        if($scope.data.length > 0){
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;
            $scope.filteredData = $scope.data.slice(begin, end);
        }
    });

});
