
angular.module('app').controller('modelsCtl', function($scope,DbChoice){
    $scope.model = "";
    $scope.modelList = [];
    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    $scope.test_db = DbChoice.dbid;
   
    $scope.$watch('model', function() {
        if ($scope.model.length > 2) {
            console.log($scope.model);
            var promise = services.model_search($scope.model);
            promise.then(
                function(result){
                    console.log(result);
                    $scope.modelList = result;
                    $scope.$apply();
                },
                function(err){
                    $scope.items = "0 items found";
                    $scope.data = [];
                    $scope.$apply();
                }
            );
        }
    });
    
});