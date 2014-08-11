// Allows for communication between controlers
angular.module('app').factory('operatorFactory', function(){
    return{
        mrvReactants:'',
        mrvProducts:'',
        spec: {
            operatorName:'',
            reactants:[],
            products:[],
            comments:'',
            "generate_reverse": false
        },
        operator:""
    };
});


angular.module('app').controller('creatorCtl',  function($scope,$state,operatorFactory) {
    $scope.operatorName= operatorFactory.spec.operatorName;
    $scope.reactants= operatorFactory.spec.reactants;
    $scope.products= operatorFactory.spec.products;
    $scope.comments= operatorFactory.spec.comments;
    $scope.opURL = "";
    $scope.cofactors=[{'id': 0, 'name': 'Any'}, {'id': 1, 'name': '2-oxoglutarate'}, {'id': 2, 'name': '3-5-ADP'},
                     {'id': 3, 'name': '5-Formyl-H4MPT'}, {'id': 4, 'name': 'Acetaldehyde'},
                     {'id': 5, 'name': 'Acetate'}, {'id': 6, 'name': 'AcetylCoa'}, {'id': 7, 'name': 'ADP'},
                     {'id': 8, 'name': 'AMP'}, {'id': 9, 'name': 'ATP'},
                     {'id': 10, 'name': 'Bicarbonate'}, {'id': 11, 'name': 'CO2'}, {'id': 12, 'name': 'CoA'},
                     {'id': 13, 'name': 'DMAPP'}, {'id': 14, 'name': 'E'}, {'id': 15, 'name': 'Formaldehyde'},
                     {'id': 16, 'name': 'glutamate'}, {'id': 17, 'name': 'H+'}, {'id': 18, 'name': 'H2O2'},
                     {'id': 19, 'name': 'H4MPT'}, {'id': 20, 'name': 'HBr'}, {'id': 21, 'name': 'HCl'},
                     {'id': 22, 'name': 'HF'}, {'id': 23, 'name': 'Histidine'}, {'id': 24, 'name': 'Indole'},
                     {'id': 25, 'name': 'IPP'}, {'id': 26, 'name': 'NAD+'}, {'id': 27, 'name': 'NADH'},
                     {'id': 28, 'name': 'NH3'}, {'id': 29, 'name': 'O2'}, {'id': 30, 'name': 'PAPS'},
                     {'id': 31, 'name': 'Phenol'}, {'id': 32, 'name': 'Phospho-Histidine'}, {'id': 33, 'name': 'Pi'},
                     {'id': 34, 'name': 'PPi'}, {'id': 35, 'name': 'S-Adenosylhomocysteine'},
                     {'id': 36, 'name': 'S-Adenosylmethionine'}, {'id': 37, 'name': 'Sulfite'},
                     {'id': 37, 'name': 'Water'}];
    $scope.compoundChoice = $scope.cofactors[0];
    $scope.indices = '';

    var services = new operatorCreator('http://bio-data-1.mcs.anl.gov/services/operator-creator');
    /*var promise = services.get_cofactors();
    promise.then(
            function(result){
                alert(result);
                $scope.cofactors = result;
                $scope.reactantChoice = $scope.cofactors[0];
                $scope.productChoice = $scope.cofactors[0];
            },
            function(err){
                alert("ERROR!");
                console.log(err);
    });
    console.log($scope.cofactors);*/

    var marvinSketcherInstance;
    MarvinJSUtil.getEditor("#sketch").then(function(sketcherInstance) {
        marvinSketcherInstance = sketcherInstance;
        marvinSketcherInstance.setDisplaySettings({
            "implicitHydrogen" : "OFF",
            "atomIndicesVisible" : true,
            "backgroundColor": "#f5f5f5"
            });
    }, function(error) {
        alert("Loading of the sketcher failed"+error);
    });

    $scope.addItem = function(array, value){
        if (array == $scope.reactants){
            array.push(value+": "+ $scope.indices);
        }
        else{
            array.push(value);
        }
    };

    $scope.removeRow = function(array, index){
        array.splice(index, 1);
    };

    $scope.mrvIO = function(key){
        //this function interchanges data between the the editor and a target variable in mrv form
        if (operatorFactory[key]) {
            marvinSketcherInstance.importStructure("mrv", operatorFactory[key]).catch(function(error) {
                alert(error);
            });
            operatorFactory[key] = '';
        }
        else {
            var exportPromise = marvinSketcherInstance.exportStructure('mrv', null);
            exportPromise.then(function (source) {
                operatorFactory[key] = source;
                $scope.$apply();
            }, function (error) {
                alert(error);
            });
        }
    };

    $scope.buttonColor = function(key){
        if (operatorFactory[key]){
            return "btn btn-success"
        }
        else {
            return "btn btn-primary"
        }
    };

    $scope.buildOp = function(){
        operatorFactory.spec = {
            "operatorName": $scope.operatorName,
            "reactants": $scope.reactants,
            "products": $scope.products,
            "comments": $scope.comments + "\nGenerated on "+ new Date().toDateString() +" by MINE Operator Creator",
            "generate_reverse": false
        };
        var promise = services.make_operator(operatorFactory.mrvReactants, operatorFactory.mrvProducts, operatorFactory.spec);
        promise.then(
            function(result){
                operatorFactory.operator = result;
                $state.go('operator');
            },
            function(err){
                alert("ERROR!");
                console.log(err);
            }
        );
    };
});

angular.module('app').controller('operatorCtl',  function($scope,$state,operatorFactory) {
    $scope.op_name = operatorFactory.spec.operatorName;
    $scope.operator = operatorFactory.operator;
    $scope.keggID = "";
    $scope.mapDatabase = "";
    $scope.testedCompounds = [];
    $scope.map_message = "";

    var services = new operatorCreator('http://bio-data-1.mcs.anl.gov/services/operator-creator');

    var validate_operator = function(op){
        if (!op) {
            alert("ERROR: Operator is blank.");
            return false
        }
        return true
    };

    $scope.testOperator = function(testCompound) {
        if (validate_operator($scope.operator)) {
            var promise = services.test_operator($scope.operator, testCompound);
            $scope.testedCompounds.push([testCompound,"Calculating..."]);
            var i = $scope.testedCompounds.length -1;
            promise.then(
                function(result){
                    $scope.testedCompounds[i][1] = result;
                    $scope.$apply();
                },
                function(err){
                    alert("ERROR!");
                    console.log(err);
                }
            );
        }
    };

    $scope.mapOperator = function(db) {
        if (validate_operator($scope.operator)) {
            var ok = confirm("Mapping an operator takes 5-10 minutes. Proceed?");
            if (ok) {
                var promise = services.map_operator($scope.operator, db, "");
                $('#map-btn').prop('disabled', true).text("Calculating...");
                promise.then(
                    function(result){
                        $scope.map_message = result;
                        $('#map-btn').prop('disabled', false).text("Map Operator");
                        $scope.$apply();
                        alert("Mapping complete!");
                    },
                    function(err){
                        alert("ERROR!");
                        console.log(err);
                        $('#map-btn').prop('disabled', false).text("Map Operator");
                    }
                );
            }
        }
    };

    $scope.goEditor = function() {
        $state.go('creator');
    };

    $scope.downloadFile = function(contents,filename) {
        var link = document.createElement('a');
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents));
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
});