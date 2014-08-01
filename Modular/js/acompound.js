// Allows for communication between controlers
angular.module('app').factory('CompoundDataFactory', function(){
    return {compound:{}};
});

angular.module('app').controller('acompoundCtl', function($scope,$stateParams,DbChoice,CompoundDataFactory){
    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    var test_db = DbChoice.dbid;
    $scope.search = $stateParams.id;
    $scope.data = CompoundDataFactory.compound;
    promise = services.get_comps(test_db, [$scope.search]);
    promise.then(
        function(result){
            //console.log(result[0]);
            $scope.data = result[0];
            CompoundDataFactory.compound = $scope.data;  // sets commmon data
            $scope.$apply();
        },
        function(err){
            console.log("acompoundCtl fail");
            $scope.data =[];
            $scope.$apply();
        }
    );

    $scope.mapLink = function(keggMap){
        window.location.assign('http://www.genome.jp/kegg-bin/show_pathway?map' + keggMap.slice(0,5) + '+' +
            $scope.data.DB_links.KEGG.join('+'));
    };

    $scope.dbLink = function(db, id) {
        switch (db) {
            case 'KEGG':
                window.open('http://www.genome.jp/dbget-bin/www_bget?cpd:' + id);
                break;
            case "CAS":
                window.open('http://www.sigmaaldrich.com/catalog/search?interface=CAS%20No.&term=' + id);
                break;
            case "ChEBI":
                window.open('http://www.ebi.ac.uk/chebi/searchId.do;92DBE16B798171059DA73B3E187F622F?chebiId=' + id);
                break;
            case "KNApSAcK":
                window.open('http://kanaya.naist.jp/knapsack_jsp/information.jsp?word=' + id);
                break;
            case "Model_SEED":
                window.open('http://seed-viewer.theseed.org/seedviewer.cgi?page=CompoundViewer&compound=' + id);
                break;
            case "NIKKAJI":
                window.open('http://nikkajiweb.jst.go.jp/nikkaji_web/pages/top_e.jsp?CONTENT=syosai&SN=' + id);
                break;
            case "PDB-CCD":
                window.open('http://www.ebi.ac.uk/pdbe-srv/pdbechem/chemicalCompound/show/' + id);
                break;
            case "PubChem":
                window.open('http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=' + id);
                break;
        }

    };
});

angular.module('app').controller('productsCtl', function($scope,$stateParams,DbChoice,CompoundDataFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.items=0;
    $scope.numPages =0;
    $scope.searchOn = "";
    

    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    var test_db = DbChoice.dbid;
    promise = services.get_rxns(test_db,CompoundDataFactory.compound.Product_of);
    promise.then(function(result){
            $scope.products = result;
            console.log(result);
            $scope.items = result.length
            $scope.totalItems = $scope.products.length;
            $scope.numPages = Math.ceil($scope.products.length / $scope.numPerPage)
            $scope.$apply();
        },
        function(err){
            console.log("productsCtl fail");
            $scope.products =[];
            $scope.$apply();
        }
    );


    $scope.$watch('currentPage + products + items + searchOn', function() {
        if((typeof($scope.products) != 'undefined') &&($scope.products.length > 0)){
var subList = [];
            for (var i = $scope.products.length - 1; i >= 0; i--) {
                console.log($scope.products[i].Operators[0]);
                if ($scope.products[i].Operators[0].indexOf($scope.searchOn) > -1){
                    subList.push($scope.products[i]); 
                }
            };
            $scope.numPages = Math.ceil(subList.length / $scope.numPerPage)
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;
            $scope.filteredData = subList.slice(begin, end);        }
    });
});


angular.module('app').controller('reactantsCtl', function($scope,$stateParams,DbChoice,CompoundDataFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.items=0;
    $scope.numPages =0;
    $scope.searchOn = "";
    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    var test_db = DbChoice.dbid;
    promise = services.get_rxns(test_db,CompoundDataFactory.compound.Reactant_in);
    promise.then(function(result){
            $scope.reactants = result;
            $scope.totalItems = $scope.reactants.length;
            $scope.numPages = Math.ceil($scope.reactants.length / $scope.numPerPage)
            $scope.$apply();
        },
        function(err){
            console.log("reactantsCtl fail");
            $scope.reactants =[];
            $scope.$apply();
        }
    );

    $scope.$watch('currentPage + reactants + items+searchOn', function() {
        if((typeof($scope.reactants) != 'undefined') &&($scope.reactants.length > 0)){
            var subList = [];
            for (var i = $scope.reactants.length - 1; i >= 0; i--) {
                console.log($scope.reactants[i].Operators[0]);
                if ($scope.reactants[i].Operators[0].indexOf($scope.searchOn) > -1){
                    subList.push($scope.reactants[i]); 
                }
            };
            $scope.numPages = Math.ceil(subList.length / $scope.numPerPage)
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;
            $scope.filteredData = subList.slice(begin, end);
        }
    });
});