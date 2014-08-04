angular.module('app').factory('DbChoice', function(){
    return {dbid:'KEGGexp',where:"home"};
});

angular.module('app').controller('resetCtl',  function (DbChoice) {
  console.log("reset");
  DbChoice.where = "home";
});

angular.module('app').controller('datbaseCtl',  function ($scope,$state,DbChoice,quickFactory,currentState) {
    $scope.name;
    $scope.databases =  [
        {id:0, name:'KEGG',  db :'KEGGexp2'},
        {id:1, name:'EcoCyc', db : 'EcoCycexp2'},
        {id:2, name:'YMDB', db : 'YMDBexp2'},
    ];
    console.log(DbChoice.where+' '+quickFactory.name);
    $scope.database = $scope.databases[0];
    $scope.$watch('database', function() {
        console.log($scope.database.db+" "+DbChoice.where+' '+quickFactory.name);
        DbChoice.dbid = $scope.database.db;
        if(DbChoice.where == "quick"){console.log("quick");
            $state.go("compounds",{search:quickFactory.name+','+DbChoice.dbid});
        }
        if (DbChoice.where == "metablomics") {
            console.log("metablomics"+DbChoice.dbid);
            $state.go("metablomicsCompounds",{search:DbChoice.dbid});
        }
        if (DbChoice.where == "structure") {
            console.log("structure"+DbChoice.dbid);
            $state.go('structuresres', {search:DbChoice.dbid});
      }
    });

});
