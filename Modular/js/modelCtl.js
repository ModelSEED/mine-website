
angular.module('app').controller('modelsCtl', function($scope,DbChoice, $state, metabolomicsDataFactory){
    $scope.model_term = metabolomicsDataFactory.model_term;
    $scope.modelList = [];
    $scope.modelChoice= "";
    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    $scope.test_db = DbChoice.dbid;
    $scope.selectedModels = metabolomicsDataFactory.params.models;
   
    $scope.$watch('model_term', function() {
        if ($scope.model_term.length > 2) {
            var promise = services.model_search($scope.model_term);
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
            metabolomicsDataFactory.params.models = $scope.modelChoice;
            metabolomicsDataFactory.model_term = $scope.model_term;
            $state.go($state.current, {}, {reload: true});
        }
    });
});