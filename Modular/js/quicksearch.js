angular.module('app').factory('quickFactory', function(){
    return {name :""};
});

angular.module('app').controller('mineCtl',  function ($scope,$state,DbChoice,quickFactory,currentState) {
    $scope.name = quickFactory.name;
    $scope.doQuickSearch = function(ev) {
        if (!ev || ev.which==13){
            quickFactory.name = $scope.name;
            currentState = 'quick';
            DbChoice.where = 'quick';
            $state.go("compounds",{search:$scope.name+','+DbChoice.dbid.db});
        }
    }
});
