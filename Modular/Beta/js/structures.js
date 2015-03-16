// Allows for communication between controllers. This factory should be improved
angular.module('app').factory('structureSearchFactory', function(){
    return{
        mol:'',
        stype:'',
        sthresh:0.7,
        maxres:10
    };
});

angular.module('app').controller('structureCtl',  function($scope,$state,structureSearchFactory) {
    $scope.stype="exact";
    $scope.maxres=100;
    $scope.sthresh=0.7;
    var marvinSketcherInstance;
    // connect to Marvin canvas and load the molfile in memory
    MarvinJSUtil.getEditor("#sketch").then(function(sketcherInstance) {
        marvinSketcherInstance = sketcherInstance;
        marvinSketcherInstance.importStructure("mol", structureSearchFactory.mol)
    }, function(error) {
        alert("Loading of the sketcher failed"+error);
    });

    $scope.find = function(){
        // store parameters & search, some of this should probably be passed as state parameters
        var exportPromise = marvinSketcherInstance.exportStructure('mol', null);
        exportPromise.then(function (source) {
            structureSearchFactory.mol = source;
            structureSearchFactory.stype = $scope.stype;
            structureSearchFactory.maxres = parseInt($scope.maxres);
            structureSearchFactory.sthresh = parseFloat($scope.sthresh);
            $state.go('structuresres');
        }, function (error) {
            alert(error);
        });
    }
});

angular.module('app').controller('structuresresCtl', function($scope,$state,sharedFactory,structureSearchFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = sharedFactory.numPerPage;
    $scope.maxSize = 5;
    $scope.items=-1;
    $scope.img_src = sharedFactory.img_src;
    var data = [];
    // the following logic should be moved to factory in future
    var services = sharedFactory.services;
    var promise;
    if (!structureSearchFactory.mol) {
        $state.go('structure')
    }
    else if (structureSearchFactory.stype == "exact"){
        promise = services.structure_search(sharedFactory.dbId,"mol",structureSearchFactory.mol);
    }
    else if (structureSearchFactory.stype == "substructure"){
        promise = services.substructure_search(sharedFactory.dbId,structureSearchFactory.mol,structureSearchFactory.maxres);
    }
    else if (structureSearchFactory.stype == "similarity"){
        promise = services.similarity_search(sharedFactory.dbId,structureSearchFactory.mol,
            structureSearchFactory.sthresh,'FP4',structureSearchFactory.maxres);
    }
    promise.then(
        function(result){
            data = result;
            $scope.items = data.length;
            $scope.filteredData = sharedFactory.paginateList(data, $scope.currentPage, $scope.numPerPage);
            $scope.$apply();
        },
        function(err){
            console.log("structure search failure")
        }
    );

    $scope.downloadResults = function(){
        var jsonObject = JSON.stringify(data);
        var exclude = {"$$hashKey":"", 'id':""};
        var csv = sharedFactory.convertToCSV(jsonObject, exclude);
        var d = new Date();
        sharedFactory.downloadFile(csv, d.toISOString()+'.csv');
    };

    $scope.$watch('currentPage', function() {
        $scope.filteredData = sharedFactory.paginateList(data, $scope.currentPage, $scope.numPerPage)
    });
});
