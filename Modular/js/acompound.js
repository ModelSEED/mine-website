// Allows for communication between controlers
angular.module('app').factory('CompoundDataFactory', function($rootScope){
    var out = {
        getCompound: function (db, id){
            if (parseInt(id)) {
                var promise = services.get_comps(db, [parseInt(id)]);
            }
            else{
                var promise = services.get_comps(db, [id]);
            }
            promise.then(
                function(result){
                    out.compound = result[0];
                    console.log(out.compound);
                    $rootScope.$broadcast("compoundLoaded")
                },
                function(err){
                    console.log("get_comps fail");
                })
        }
    };
    return out
});

angular.module('app').controller('acompoundCtl', function($scope,$stateParams,DbChoice,CompoundDataFactory){
    CompoundDataFactory.getCompound(DbChoice.dbid, $stateParams.id);
    $scope.img_src = img_src;

    $scope.$on("compoundLoaded", function () {
        //console.log("compLoaded");
        $scope.data = CompoundDataFactory.compound;
        $scope.$apply();
    });

    $scope.launch_lightbox = function () {
        $("#cpd-img").lightbox_me({
            overlayCSS: {background: 'black', opacity:.6}
        })
    };

    $scope.mapLink = function(keggMap){
        return('http://www.genome.jp/kegg-bin/show_pathway?map' + keggMap.slice(0,5) + '+' +
            $scope.data.DB_links.KEGG.join('+'));
    };

    $scope.dbLink = function(db, id) {
        switch (db) {
            case 'KEGG':
                return('http://www.genome.jp/dbget-bin/www_bget?cpd:' + id);
                break;
            case "CAS":
                return('http://www.sigmaaldrich.com/catalog/search?interface=CAS%20No.&term=' + id);
                break;
            case "ChEBI":
                return('http://www.ebi.ac.uk/chebi/searchId.do;92DBE16B798171059DA73B3E187F622F?chebiId=' + id);
                break;
            case "KNApSAcK":
                return('http://kanaya.naist.jp/knapsack_jsp/information.jsp?word=' + id);
                break;
            case "Model_SEED":
                return('http://seed-viewer.theseed.org/seedviewer.cgi?page=CompoundViewer&compound=' + id);
                break;
            case "NIKKAJI":
                return('http://nikkajiweb.jst.go.jp/nikkaji_web/pages/top_e.jsp?CONTENT=syosai&SN=' + id);
                break;
            case "PDB-CCD":
                return('http://www.ebi.ac.uk/pdbe-srv/pdbechem/chemicalCompound/show/' + id);
                break;
            case "PubChem":
                return('http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=' + id);
                break;
            default:
                return("");
        }

    };
});

angular.module('app').controller('productsCtl', function($scope,$stateParams,DbChoice,CompoundDataFactory,$sce){
    $scope.currentPage = 1;
    $scope.numPerPage = 25;
    $scope.maxSize = 5;
    $scope.items=0;
    $scope.searchOn = "";
    $scope.img_src = img_src;
    var services = new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database');
    if (!CompoundDataFactory.compound) {
        CompoundDataFactory.getCompound(DbChoice.dbid, $stateParams.id);
    }
    else {
        get_products()
    }
    function get_products() {
        var promise = services.get_rxns(DbChoice.dbid, CompoundDataFactory.compound.Product_of);
        promise.then(function (result) {
                $scope.products = result;
                $scope.items = result.length;
                $scope.totalItems = $scope.products.length;
                $scope.$apply();
            },
            function (err) {
                console.log("productsCtl fail");
                $scope.products = [];
                $scope.$apply();
            }
        );
    }

    $scope.$on("compoundLoaded", function () {
        console.log("compLoaded");
        get_products();
    });

    $scope.getCompoundName= function($event, id){
        if ((!$($event.target).data('bs.popover')) && (id[0] == "C")) {
            var gPromise = services.get_comps(DbChoice.dbid, [id]);
            gPromise.then(
                function (result) {
                    var cTitle;
                    if (result[0].Names) {
                        cTitle = result[0].Names[0]
                    }
                    else if (result[0].MINE_id) {
                        cTitle = result[0].MINE_id
                    }
                    if (cTitle) {
                        $($event.target).popover({title: cTitle,
                            trigger: 'hover',
                            html: true,
                            content: '<img src="' + img_src + id + '.svg" width="250">'
                        });
                        $($event.target).popover('show');
                    }
                },
                function (err) {
                    console.log("acompoundCtl fail");
                    $scope.data = [];
                    $scope.$apply();
                }
            );
        }
    };

    $scope.$watch('currentPage + products + items + searchOn', function() {
        if((typeof($scope.products) != 'undefined') &&($scope.products.length > 0)){
        var subList = [];
            for (var i = $scope.products.length - 1; i >= 0; i--) {
                if ($scope.products[i].Operators[0].indexOf($scope.searchOn) > -1){
                    subList.push($scope.products[i]);
                }
            }
            $scope.totalItems = subList.length;
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;
            $scope.filteredData = subList.slice(begin, end);        }
    });
});


angular.module('app').controller('reactantsCtl', function($scope,$stateParams,DbChoice,CompoundDataFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = 25;
    $scope.maxSize = 5;
    $scope.items=0;
    $scope.searchOn = "";
    $scope.img_src = img_src;
    if (!CompoundDataFactory.compound){
        CompoundDataFactory.getCompound(DbChoice.dbid, $stateParams.id);
    }
    else{
        get_reactants()
    }

    function get_reactants() {
        var promise = services.get_rxns(DbChoice.dbid, CompoundDataFactory.compound.Reactant_in);
        promise.then(function (result) {
                $scope.reactants = result;
                $scope.items = result.length;
                $scope.totalItems = $scope.reactants.length;
                $scope.$apply();
            },
            function (err) {
                console.log("reactantsCtl fail");
                $scope.reactants = [];
                $scope.$apply();
            }
        );
    }

    $scope.$on("compoundLoaded", function () {
        console.log("compLoaded");
        get_reactants();
    });

    $scope.getCompoundName= function($event, id){
        if ((!$($event.target).data('bs.popover')) && (id[0] == "C")) {
            var gPromise = services.get_comps(DbChoice.dbid, [id]);
            gPromise.then(
                function (result) {
                    var cTitle;
                    if (result[0].Names) {
                        cTitle = result[0].Names[0]
                    }
                    else if (result[0].MINE_id) {
                        cTitle = result[0].MINE_id
                    }
                    if (cTitle) {
                        $($event.target).popover({title: cTitle,
                            trigger: 'hover',
                            html: true,
                            content: '<img src="' + img_src + id + '.svg" width="250">'
                        });
                        $($event.target).popover('show');
                    }
                },
                function (err) {
                    console.log("acompoundCtl fail");
                    $scope.data = [];
                    $scope.$apply();
                }
            );
        }
    };

    $scope.$watch('currentPage + reactants + items+searchOn', function() {
        if((typeof($scope.reactants) != 'undefined') &&($scope.reactants.length > 0)){
            var subList = [];
            for (var i = $scope.reactants.length - 1; i >= 0; i--) {
                if ($scope.reactants[i].Operators[0].indexOf($scope.searchOn) > -1){
                    subList.push($scope.reactants[i]);
                }
            }
            $scope.totalItems = subList.length;
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;
            $scope.filteredData = subList.slice(begin, end);
        }
    });
});
