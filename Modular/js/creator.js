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
    $scope.tour = false;

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
        initializeTour();
        $scope.tour = true
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
    function initializeTour(){
        $scope.tourConfig = [
            {
                type: "title",
                heading: "Welcome to the Operator Creator Tour",
                text: "This Demo will walk you through the basics of generating reaction rules with the MINE operator" +
                    " creator tool. However it won't cover the how to successfully generalize chemistry."

            },
            {
                type: "element",
                selector: "#opName",
                heading: "Operator Name",
                placement: "left",
                text: "You should give your operator a descriptive name. If it's a based on enzyme chemistry this is " +
                    "usually a variation on the EC class covered",
                scroll: true
            },
            {
                type: "element",
                selector: "#canvas",
                heading: "Marvin Canvas",
                text: "This is the canvas for sketching the structures of reactants and products. Special atoms and " +
                    "ring codes can be entered using the psudoatom button. Click the A at the lower right-hand panel " +
                    "and select the blue question mark. Alternates atoms should be separated with commas and ring-codes " +
                    "with underscores.",
                scroll: true
            },
            {
                type: "function",
                fn: loadReactants
            },
            {
                type: "element",
                selector: "#canvas",
                heading: "Example Reactants",
                text: "Here we've loaded an example reactant. Note the representation of all bonds and hydrogen atoms" +
                    " not explicitly drawn using psudoatoms.",
                scroll: true
            },
            {
                type: "element",
                selector: "#btn-setR",
                heading: "Set the Reactants",
                text: "When we are happy with the display of the reactants we can set them by clicking this button",
                placement: "left",
                scroll: true
            },
            {
                type: "function",
                fn: setReactants
            },
            {
                type: "element",
                selector: "#btn-setR",
                heading: "Reactants are set",
                text: "Note how the button turns green when the reactants are set. If we want to change the reactants" +
                    " later, all we need to do is click the button to load them back into the editor",
                placement: "left",
                scroll: true
            },
            {
                type: "element",
                selector: "#compoundSelect",
                heading: "Enter reactant information",
                text: "Now we may add in compound information. Select a specific cofactor or Any and enter the atoms" +
                    " spanned by that compound",
                placement: "left",
                scroll: true
            },
            {
                type: "element",
                selector: "#compoundAdd",
                heading: "Add reactant information",
                text: "Click to add the data above to the product or reactant arrays.",
                placement: "left",
                scroll: true
            },
            {
                type: "function",
                fn: loadProducts
            },
            {
                type: "element",
                selector: "#canvas",
                heading: "Model reaction changes",
                text: "Now we can model the reaction changes by adding or removing bonds. During this process it's " +
                    "important not to add or delete atoms because this could corrupt the atom indexing and lead to " +
                    "nonsensical operators.",
                scroll: true
            },
            {
                type: "function",
                fn: fillForm
            },
            {
                type: "element",
                selector: "#op-form",
                heading: "Fill out the rest of the details",
                text: "Next fill in all the remaining information",
                placement: "left",
                scroll: true
            },
            {
                type: "function",
                fn: setProducts
            },
            {
                type: "element",
                selector: "#bottom-btns",
                heading: "Fill out the rest of the details",
                text: "With the for filled out and the reactants and products loaded we are ready to gen",
                placement: "left",
                scroll: true
            },
            {
                type: "function",
                fn: buildOp
            },
            {
                type: "element",
                selector: "#op-text",
                heading: "Operator text",
                text: "This is the text that was generated that represents the chemical transformation. You can edit the " +
                    "text here and see it's impact on the operators function if necessary",
                scroll: true
            },
            {
                type: "element",
                selector: "#cpd-test",
                heading: "Test reactivity with kegg compounds",
                text: "This feature let's you enter a KEGG compound ID to check how many reactions the operator predicts.",
                placement: "left",
                scroll: true
            },
            {
                type: "element",
                selector: "#map-test",
                heading: "Test reaction mapping",
                text: "This feature let's you test how many total reactions the operator predicts when run against all KEGG" +
                    "compounds as well as how many of those predicted reactions are present in KEGG. This test takes up to" +
                    "ten minutes to run though so be sure your operator is correct before testing.",
                placement: "left",
                scroll: true
            },
            {
                type: "title",
                heading: "Next Steps",
                text: "That's the basics of using this web tool to create operators."
            }
        ];

        function loadReactants() {
            marvinSketcherInstance.importStructure("mrv",'<cml><MDocument><MChemicalStruct><molecule molID="m1"><atomArray><atom id="a1" elementType="C" x2="-1.9166666666666667" y2="4.644200547784747" mrvPseudo="CH_W"/><atom id="a2" elementType="C" x2="-3.2503360077149255" y2="3.874183607225707" mrvPseudo="CH_W"/><atom id="a3" elementType="C" x2="-3.2503360077149255" y2="2.334149726107626" mrvPseudo="CH_W"/><atom id="a4" elementType="C" x2="-1.9166666666666667" y2="1.5641327855485854" mrvPseudo="CH_W"/><atom id="a5" elementType="C" x2="-0.5829973256184084" y2="2.334149726107626" mrvPseudo="CH_W"/><atom id="a6" elementType="C" x2="-0.5829973256184084" y2="3.874183607225707"/><atom id="a7" elementType="O" x2="0.7506817962096273" y2="4.644183607225707"/><atom id="a8" elementType="H" x2="0.1736421646374966" y2="6.043297435888288"/></atomArray><bondArray><bond atomRefs2="a6 a7" order="1"/><bond atomRefs2="a1 a6" order="2"/><bond atomRefs2="a1 a2" order="1"/><bond atomRefs2="a2 a3" order="2"/><bond atomRefs2="a3 a4" order="1"/><bond atomRefs2="a5 a6" order="1"/><bond atomRefs2="a4 a5" order="2"/><bond atomRefs2="a8 a7" order="1"/></bondArray></molecule></MChemicalStruct></MDocument></cml>').catch(function(error) {
              alert(error);
            });
        }
        function loadProducts() {
            marvinSketcherInstance.importStructure("mrv",'<cml><MDocument><MChemicalStruct><molecule molID="m1"><atomArray><atom id="a1" elementType="C" x2="-1.9166666666666667" y2="4.644200547784747" mrvPseudo="CH_W"/><atom id="a2" elementType="C" x2="-3.2503360077149255" y2="3.874183607225707" mrvPseudo="CH_W"/><atom id="a3" elementType="C" x2="-3.2503360077149255" y2="2.334149726107626" mrvPseudo="CH_W"/><atom id="a4" elementType="C" x2="-1.9166666666666667" y2="1.5641327855485854" mrvPseudo="CH_W"/><atom id="a5" elementType="C" x2="-0.5829973256184084" y2="2.334149726107626" mrvPseudo="CH_W"/><atom id="a6" elementType="C" x2="-0.5829973256184084" y2="3.874183607225707"/><atom id="a7" elementType="O" x2="0.7506817962096273" y2="4.644183607225707"/><atom id="a8" elementType="H" x2="-1.9096911686958364" y2="6.001630769221622"/></atomArray><bondArray><bond atomRefs2="a6 a7" order="2"/><bond atomRefs2="a1 a6" order="1"/><bond atomRefs2="a8 a1" order="1"/><bond atomRefs2="a1 a2" order="1"/><bond atomRefs2="a2 a3" order="2"/><bond atomRefs2="a3 a4" order="1"/><bond atomRefs2="a5 a6" order="1"/><bond atomRefs2="a4 a5" order="2"/></bondArray></molecule></MChemicalStruct></MDocument></cml>').catch(function(error) {
            alert(error);
            });
        }
        function fillForm() {
            $scope.opName='Example_Operator';
            $scope.reactants = ['Any: 1-8'];
            $scope.products = ['Any'];
            $scope.comments = 'This is an example operator'

        }
        function setReactants(){
            $scope.mrvIO("mrvReactants")
        }
        function setProducts(){
            $scope.mrvIO("mrvProducts")
        }
        function buildOp() {
            $scope.buildOp()
        }
    }
    $scope.startOpTour = function () {
        $scope.startJoyRide = true;
    };
});

angular.module('app').controller('operatorCtl',  function($scope,$state,operatorFactory) {
    $scope.op_name = operatorFactory.spec.operatorName;
    $scope.operator = operatorFactory.operator;
    $scope.keggID = "";
    $scope.mapDatabase = "";
    $scope.testedCompounds = [];
    $scope.mappedReactions = "";

    var services = new operatorCreator('http://bio-data-1.mcs.anl.gov/services/operator-creator');

    $scope.uploadOperator = function(){
        var selectedFile = document.getElementById('operatorFile').files[0];
        var reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload=function(){
            $scope.operator = reader.result;
            $scope.$apply();
        }
    };

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
                        $scope.mappedReactions = result;
                        console.log(result);
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