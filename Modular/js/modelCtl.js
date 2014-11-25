
angular.module('app').controller('modelsCtl', function($scope, $state, sharedFactory, metabolomicsDataFactory){
    $scope.model_term = metabolomicsDataFactory.model_term;
    $scope.modelList = [];
    $scope.modelChoice= "";
    $scope.selectedModels = metabolomicsDataFactory.params.models;
   
    $scope.$watch('model_term', function() {
        if ($scope.model_term.length > 2) {
            var promise = sharedFactory.services.model_search($scope.model_term);
            promise.then(
                function(result){
                    $scope.modelList = result;
                    $scope.$apply();
                },
                function(err){
                    console.log("Model Search Failure")
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