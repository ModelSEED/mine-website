// Allows for communication between controlers
angular.module('app').factory('structuresresFactory', function(){
    return{
        mol:'',
        stype:'',
        sthresh:0.7,
        maxres:10
    };
});


angular.module('app').controller('structureCtl',  function($scope,$state,DbChoice,structuresresFactory) {
    $scope.stype="similarity";
    $scope.maxres=100;
    $scope.sthresh=0.7;
    DbChoice.where = "";
    var marvinSketcherInstance;
    console.log("at structureCtl"+DbChoice.dbid);
    MarvinJSUtil.getEditor("#sketch").then(function(sketcherInstance) {
        marvinSketcherInstance = sketcherInstance;
        marvinSketcherInstance.importStructure("mol", structuresresFactory.mol)
    }, function(error) {
        alert("Loading of the sketcher failed"+error);
    });

    $scope.find = function(){
        var exportPromise = marvinSketcherInstance.exportStructure('mol', null);
        exportPromise.then(function (source) {
            $state.go('structuresres');
            structuresresFactory.mol = source;
            structuresresFactory.stype = $scope.stype;
            structuresresFactory.maxres = parseInt($scope.maxres);
            structuresresFactory.sthresh = parseFloat($scope.sthresh);
        }, function (error) {
            alert(error);
        });
    }
});

angular.module('app').controller('structuresresCtl', function($scope,DbChoice,structuresresFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = 25;
    $scope.maxSize = 5;
    $scope.items=0;
    $scope.data=[];
    DbChoice.where = 'structure';
    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    var promise;
    if (structuresresFactory.stype == "exact"){
        promise = services.structure_search(DbChoice.dbid,"mol",structuresresFactory.mol);
    }
    if (structuresresFactory.stype == "substructure"){
        promise = services.substructure_search(DbChoice.dbid,structuresresFactory.mol,structuresresFactory.maxres);
    }
    if (structuresresFactory.stype == "similarity"){
        promise = services.similarity_search(DbChoice.dbid,structuresresFactory.mol,structuresresFactory.sthresh,'FP4',structuresresFactory.maxres);
    }
    promise.then(
            function(result){
                if(result.length >1){
                    $scope.items = result.length+ " items found";
                }else{
                     $scope.items = result.length+ " item found";
                }
                $scope.data = result;
                $scope.totalItems = $scope.data.length;
                $scope.$apply();
            },
            function(err){
                $scope.items = "0 items found";
                $scope.data = [];
                $scope.$apply();
            }
    );


    $scope.$watch('currentPage + items', function() {
        if($scope.data.length > 0){
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;
            $scope.filteredData = $scope.data.slice(begin, end);
        }
    });

});
