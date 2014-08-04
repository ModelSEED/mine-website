angular.module('app').factory('quickFactory', function(){
    return {name :""};
});

angular.module('app').controller('mineCtl',  function ($scope,$state,DbChoice,quickFactory,currentState) {
    $scope.name = quickFactory.name;
    currentState = 'quick';
    DbChoice.where = 'quick';
    $scope.doQuickSearch = function(ev) {
        if (ev.which==13){
            quickFactory.name = $scope.name;
            currentState = 'quick';
            DbChoice.where = 'quick';
            console.log("here"+$scope.name)
            $state.go("compounds",{search:$scope.name+','+DbChoice.dbid.db});
        }
    }
});
