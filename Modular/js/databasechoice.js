angular.module('app').factory('DbChoice', function(){
    return {dbid:'KEGGexp',where:"home"};
});

angular.module('app').controller('resetCtl',  function ($scope, DbChoice) {
    console.log("reset");
    DbChoice.where = "home";
    $scope.startGeneralTour = function () {
        var tour = new Tour(generalTour());
        tour.init();
        tour.start();
    };
    $scope.startMetabolomicsTour = function () {
        var tour = new Tour(metabolomicsTour());
        tour.init();
        tour.start();
    };
});

angular.module('app').controller('databaseCtl',  function ($scope,$state,DbChoice,quickFactory) {
    $scope.otherDB = '';
    $scope.databases =  [
        {id:0, name:'KEGG',  db :'KEGGexp2'},
        {id:1, name:'EcoCyc', db : 'EcoCycexp2'},
        {id:2, name:'YMDB', db : 'YMDBexp2'}
        //{id:3, name:'Other', db : ''}
    ];
    console.log(DbChoice.where+' '+quickFactory.name);
    $scope.database = $scope.databases[0];
    $scope.$watch('database', function() {
        //console.log($scope.database.db+" "+DbChoice.where+' '+quickFactory.name);
        DbChoice.dbid = $scope.database.db;
        if($scope.database.id == 3) {DbChoice.dbid = $scope.otherDB;}
        if(DbChoice.where == "quick"){console.log("quick");
            $state.go("compounds",{search:quickFactory.name+','+DbChoice.dbid});
        }
        if (DbChoice.where == "metabolomics") {
            //console.log("metabolomics"+DbChoice.dbid);
            $state.go("metabolomicsCompounds",{search:DbChoice.dbid});
        }
        if (DbChoice.where == "structure") {
            //console.log("structure"+DbChoice.dbid);
            $state.go('structuresres', {search:DbChoice.dbid});
        }
    });

});
