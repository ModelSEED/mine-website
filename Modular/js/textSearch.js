angular.module('app').controller('quickSearchCtl',  function ($scope,$state) {
    $scope.doQuickSearch = function(ev) {
        if (!ev || ev.which==13) $state.go("compounds",{search:$scope.name});
    }
});

angular.module('app').controller('advancedSearchCtl', function($scope,$state){
    $scope.and = [];
    $scope.or = [];
    $scope.not = [];
    $scope.value = "";
    $scope.RegEx = false;
    $scope.fields = [
        {'id': 0, 'name': '"_id"'}, {'id': 1, 'name': '"SMILES"'}, {'id': 2, 'name': '"NP_likeness"'},
        {'id': 3, 'name': '"MINE_id"'}, {'id': 4, 'name': '"Inchikey"'}, {'id': 5, 'name': '"Charge"'},
        {'id': 6, 'name': '"Mass"'}, {'id': 7, 'name': '"Formula"'}, {'id': 8, 'name': '"Names"'},
        {'id': 9, 'name': '"Pathways"'}, {'id': 10, 'name': '"Enzymes"'}, {'id': 11, 'name': '"Product_of"'},
        {'id': 12, 'name': '"Reactant_in"'}, {'id': 13, 'name': '"FP4"'}, {'id': 14, 'name': '"FP2"'},
        {'id': 15, 'name': '"steps_from_source"'}, {'id': 16, 'name': '"DB_links.KEGG"'},
        {'id': 17, 'name': '"DB_links.PubChem"'}, {'id': 18, 'name': '"DB_links.CAS"'},
        {'id': 19, 'name': '"DB_links.ChEBI"'}, {'id': 20, 'name': '"DB_links.KNApSAcK"'},
        {'id': 21, 'name': '"DB_links.Model_SEED"'}, {'id': 22, 'name': '"DB_links.NIKKAJI"'},
        {'id': 23, 'name': '"DB_links.PDB-CCD"'}];
    $scope.selected = $scope.fields[0];
    $scope.addItem = function(array, field, value){
        if (value) {
            if (parseFloat(value+1)) array.push([field, value, $scope.RegEx]);
            else array.push([field, '"'+value+'"', $scope.RegEx]);
        }
    };

    $scope.removeRow = function(array, index){
        array.splice(index, 1);
    };
    var mongoizeArray = function(query, operator, array){
        if (query) query += ", ";
        else query += "{";
        query += operator+":[";
        for (var i = 0; i < array.length; i++) {
            if (array[i][2]) query += "{" + array[i][0] + ' : {"$regex":' + array[i][1] + "}}, ";
            else query += "{" + array[i][0] + ":" + array[i][1] + "}, ";
        }
        query = query.substring(0,query.length-2) + "]";
        return query

    };

    $scope.search = function(and,or,not){
        var query = "";
        if (and.length) query = mongoizeArray(query, '"$and"', and);
        if (or.length) query = mongoizeArray(query, '"$or"', or);
        //if (not.length) query = mongoizeArray(query, '"$not"', not);
        query += "}";
        console.log(query);
        $state.go('compounds', {'search':query})
    }
});

angular.module('app').controller('compoundsCtl', function($scope,$stateParams,sharedFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = 25;
    $scope.maxSize = 5;
    $scope.items=-1;
    var data=[];
    var promise;
    var services = sharedFactory.services;

    console.log($stateParams.search)
    if ($stateParams.search[0] == '{') promise = services.database_query(sharedFactory.dbId, $stateParams.search);
    else promise = services.quick_search(sharedFactory.dbId, $stateParams.search);
    promise.then(
            function(result){
                data = result;
                $scope.items = data.length;
                $scope.filteredData = sharedFactory.paginateList(data, $scope.currentPage, $scope.numPerPage);
                $scope.$apply();
            },
            function(err){
                $scope.items=0;
                $scope.$apply();
                console.log("Quick Search Failure")
            }
    );

    $scope.formatNames = function(nameArray) {
        if (nameArray.length < 6) return nameArray.join('\n');
        else return nameArray.slice(0,5).join('\n') + "\n...";
    };

    $scope.$watch('currentPage', function() {
        if (data) {
            $scope.filteredData = sharedFactory.paginateList(data, $scope.currentPage, $scope.numPerPage)
        }
    });

});
