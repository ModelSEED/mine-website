angular.module('app').controller('quickSearchCtl',  function ($scope,$state) {
    $scope.doQuickSearch = function(ev) {
        if (!ev || ev.which==13) $state.go("compounds",{search:$scope.name});
    }
});

angular.module('app').controller('advancedSearchCtl', function($scope,sharedFactory){
    $scope.and = [];
    $scope.or = [];
    $scope.not = [];
    $scope.value = "";
    $scope.fields = [{'id': 0, 'name': 'Any', type:"int"}, {'id': 1, 'name': 'meh', type:"float"}, {'id': 2, 'name': 'moo', type:"int"}];
    $scope.selected = $scope.fields[0];
    $scope.addItem = function(array, field, value){
        if (value) {
            if (parseFloat(value)) array.push([field, value]);
            else array.push([field, '"'+value+'"']);
        }
    };

    $scope.removeRow = function(array, index){
        array.splice(index, 1);
    };
    var mongoizeArray = function(query, operator, array){
        console.log(operator)
        if (query) query += ", ";
        else query += "{";
        query += operator+":[";
        for (var i = 0; i < array.length-1  ; i++) {
            query += "{" + array[i][0] + " : " + array[i][1] + "}, "
        }
        query += "{" + array[array.length-1][0] + " : " + array[array.length-1][1] + "}]";
        return query

    };

    $scope.search = function(and,or,not){
        var query = "";
        if (and.length) query += mongoizeArray(query, "$and", and);
        if (or.length) query += mongoizeArray(query, "$or", or);
        if (not.length) query += mongoizeArray(query, "$not", not);
        query += "}";
        alert(query)
    }
});

angular.module('app').controller('compoundsCtl', function($scope,$stateParams,sharedFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = 25;
    $scope.maxSize = 5;
    $scope.items=-1;
    var data=[];
    var services = sharedFactory.services;

    $scope.formatNames = function(nameArray) {
        if (nameArray.length < 6) return nameArray.join('\n');
        else return nameArray.slice(0,5).join('\n') + "\n...";
    };

    var promise = services.quick_search(sharedFactory.dbId, $stateParams.search);
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

    $scope.$watch('currentPage', function() {
        if (data) {
            $scope.filteredData = sharedFactory.paginateList(data, $scope.currentPage, $scope.numPerPage)
        }
    });

});
