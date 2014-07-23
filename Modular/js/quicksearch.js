angular.module('app').factory('DbChoice', function(){
    return {dbid:'KEGGexp'};
});

angular.module('app').controller('mineCtl',  function ($scope,$state,DbChoice) {
    $scope.databases =  [
        {id:0, name:'KEGG',  db :'KEGGexp2'},
        {id:1, name:'EcoCyc', db : 'EcoCycexp2'},
        {id:2, name:'YMDB', db : 'YMDBexp2'},
    ];
    $scope.database = $scope.databases[0]; 
    $scope.$watch('database', function() {
        DbChoice.dbid = $scope.database.db;

    $scope.doQuickSearch = function(ev) {
        if (ev.which==13){
            $state.go("compounds",{search:$scope.name+','+$scope.database.db});
        }
    }
    });
});
