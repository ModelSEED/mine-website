angular.module('app').factory('DbChoice', function(){
    return {dbid:'KEGGexp'};
});

angular.module('app').controller('mineCtl',  function ($scope,DbChoice) {
    $scope.databases =  [
        {id:0, name:'KEGG',  db :'KEGGexp'},
        {id:1, name:'EcoCyc', db : 'EcoCycexp'},
        {id:2, name:'YMDB', db : 'YMDBexp'},
    ];
    $scope.database = $scope.databases[0]; 
    $scope.$watch('database', function() {
        DbChoice.dbid = $scope.database.db;
    });
});
