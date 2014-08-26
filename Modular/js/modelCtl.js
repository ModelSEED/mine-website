
angular.module('app').controller('modelsCtl', function($scope,DbChoice, $state, metabolomicsDataFactory){
    $scope.model = metabolomicsDataFactory.model;
    $scope.modelList = [];
    $scope.modelChoice= "";
    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    $scope.test_db = DbChoice.dbid;
    $scope.selectedModels = metabolomicsDataFactory.metaModels
   
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
    $scope.$watch('modelChoice', function() {
        if ($scope.modelChoice) {
            metabolomicsDataFactory.metaModels = $scope.modelChoice;
            metabolomicsDataFactory.model = $scope.model;
            $state.go($state.current, {}, {reload: true});
        }
    });
});