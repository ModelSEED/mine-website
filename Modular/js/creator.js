// Allows for communication between controlers
angular.module('app').factory('operatorFactory', function(){
    return{
        mrvReactants:'',
        mrvProducts:'',
        operatorName:'',
        reactants:[],
        products:[],
        comments:'',
        "generate_reverse": false
    };
});


angular.module('app').controller('creatorCtl',  function($scope,$state,operatorFactory) {
    $scope.operatorName= '';
    $scope.reactants= [];
    $scope.products= [];
    $scope.comments= '';
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

    $scope.setReact = function(){
        if (operatorFactory.mrvReactants) {
            marvinSketcherInstance.importStructure("mrv", operatorFactory.mrvReactants).catch(function(error) {
                alert(error);
            });
            operatorFactory.mrvReactants = '';
            document.getElementById("btn-setReact").className = "btn btn-primary";
        }
        else {
            var exportPromise = marvinSketcherInstance.exportStructure('mrv', null);
            exportPromise.then(function (source) {
                operatorFactory.mrvReactants = source;
                document.getElementById("btn-setReact").className = "btn btn-success";
            }, function (error) {
                alert(error);
            });
        }
    };

    $scope.setProd = function(){
        if (operatorFactory.mrvProducts) {
            marvinSketcherInstance.importStructure("mrv", operatorFactory.mrvProducts).catch(function(error) {
                alert(error);
            });
            operatorFactory.mrvProducts = '';
            document.getElementById("btn-setProd").className = "btn btn-primary";
        }
        else {
            var exportPromise = marvinSketcherInstance.exportStructure('mrv', null);
            exportPromise.then(function (source) {
                operatorFactory.mrvProducts = source;
                document.getElementById("btn-setProd").className = "btn btn-success";
            }, function (error) {
                alert(error);
            });
        }
    };

    $scope.buildOp = function(){
        var spec = {
            "operatorName": $scope.operatorName,
            "reactants": $scope.reactants,
            "products": $scope.products,
            "comments": $scope.comments,
            "generate_reverse": false
        };
        var promise = services.make_operator(operatorFactory.mrvReactants, operatorFactory.mrvProducts, spec);
        promise.then(
            function(result){
                var ok = confirm(result);
                if (ok){
                    document.getElementById("btn-genOp").className = "btn btn-success";
                    var pom = document.createElement('a');
                    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result));
                    pom.setAttribute('download', $scope.operatorName+'.dat');
                    document.body.appendChild(pom);
                    pom.click();
                    document.body.removeChild(pom);
                }
            },
            function(err){
                alert("ERROR!");
                console.log(err);
            }
        );
    };
});

angular.module('app').controller('operatorCtl',  function($scope,$state,operatorFactory) {
    $scope.operatorName= operatorFactory.operatorName;
    //$scope.op = operatorFactory.op;
});