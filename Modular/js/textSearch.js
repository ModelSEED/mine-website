angular.module('app').controller('quickSearchCtl',  function ($scope,$state) {
    $scope.doQuickSearch = function(ev) {
        if (!ev || ev.which==13) $state.go("compounds",{search:$scope.name});
    }
});

angular.module('app').controller('compoundsCtl', function($scope,$stateParams,sharedFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = 25;
    $scope.maxSize = 5;
    $scope.items=0;
    var data=[];
    var services = sharedFactory.services;

    $scope.formatNames = function(nameArray) {
        if (nameArray.length < 6) return nameArray.join('\n');
        else return nameArray.slice(0,5).join('\n') + "\n...";
    };

    var promise = services.quick_search(sharedFactory.dbId, $stateParams.search);
    promise.then(
            function(result){
                data = result;
                $scope.items = data.length;
                $scope.filteredData = sharedFactory.paginateList(data, $scope.currentPage, $scope.numPerPage);
                $scope.$apply();
            },
            function(err){
                console.log("Quick Search Failure")
            }
    );

    $scope.$watch('currentPage', function() {
        if (data) {
            $scope.filteredData = sharedFactory.paginateList(data, $scope.currentPage, $scope.numPerPage)
        }
    });

});
