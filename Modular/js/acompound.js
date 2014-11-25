angular.module('app').factory('CompoundDataFactory', function($rootScope){
    var factory = {
        services: new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database'),
        img_src: "http://lincolnpark.chem-eng.northwestern.edu/Smiles_dump/",
        getCompound: function (db, id){
            var promise;
            //Controls for _id and MINE ids
            if (parseInt(id)) {promise = sharedFactory.services.get_comps(db, [parseInt(id)]);}
            else{promise = factory.services.get_comps(db, [id]);}
            promise.then(
                function(result){
                    factory.compound = result[0];
                    $rootScope.$broadcast("compoundLoaded")
                },
                function(err){console.log("get_comps fail");}
            )
        },
        getReactions: function(db, rxn_ids) {
            var promise = factory.services.get_rxns(db, rxn_ids);
            promise.then(function (result) {
                    factory.reactions = result;
                    $rootScope.$broadcast("rxnLoaded")
                },
                function (err) {console.log("get_rxns fail");}
            );
        },
        //EC filtering
        filterList: function(reactions, searchOn) {
            if ((typeof(reactions) != 'undefined') && (reactions.length > 0)) {
                var subList = [];
                for (var i = reactions.length - 1; i >= 0; i--) {
                    for (var j = reactions[i].Operators.length - 1; j >= 0; j--) {
                        if ((reactions[i].Operators[j].indexOf(searchOn) > -1)&&(subList[subList.length-1] != reactions[i])) {
                            subList.push(reactions[i]);
                        }
                    }
                }
                return subList
            }
        },
        //Popups with image & name
        getCompoundName: function(db){
            return function($event, id) {
                if ((!$($event.target).data('bs.popover')) && (id[0] == "C")) {
                    var Promise = factory.services.get_comps(db, [id]);
                    Promise.then(
                        function (result) {
                            var cTitle;
                            if (result[0].Names) {cTitle = result[0].Names[0]}
                            else if (result[0].MINE_id) {cTitle = result[0].MINE_id}
                            if (cTitle) {
                                $($event.target).popover({
                                    title: cTitle,
                                    trigger: 'hover',
                                    html: true,
                                    content: '<img src="' + factory.img_src + id + '.svg" width="250">'
                                });
                            }
                        },
                        function (err) {console.log("getCompoundName fail");}
                    );
                }
            }
        }
    };
    return factory
});

angular.module('app').controller('acompoundCtl', function($scope,$stateParams,sharedFactory,CompoundDataFactory){
    CompoundDataFactory.getCompound(sharedFactory.dbId, $stateParams.id);
    $scope.img_src = sharedFactory.img_src;

    $scope.$on("compoundLoaded", function () {
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

    //This should probably be a directive
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

angular.module('app').controller('productOfCtl', function($scope,$stateParams,sharedFactory,CompoundDataFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = 25;
    $scope.maxSize = 5;
    $scope.img_src = sharedFactory.img_src;
    var reactions;
    if (!CompoundDataFactory.compound) {
        CompoundDataFactory.getCompound(sharedFactory.dbId, $stateParams.id);
    }
    else {
        CompoundDataFactory.getReactions(sharedFactory.dbId, CompoundDataFactory.compound.Product_of);
    }

    $scope.$on("compoundLoaded", function () {
        CompoundDataFactory.getReactions(sharedFactory.dbId, CompoundDataFactory.compound.Product_of);
    });

    $scope.$on("rxnLoaded", function () {
        reactions = CompoundDataFactory.reactions;
        $scope.filteredData = sharedFactory.paginateList(reactions, $scope.currentPage, $scope.numPerPage);
        $scope.items = reactions.length;
        $scope.$apply();
    });

    $scope.getCompoundName = CompoundDataFactory.getCompoundName(sharedFactory.dbId);

    $scope.$watch('currentPage +searchOn', function() {
        if (reactions) {
            var filteredRxns = CompoundDataFactory.filterList(reactions, $scope.searchOn);
            $scope.filteredData = sharedFactory.paginateList(filteredRxns, $scope.currentPage, $scope.numPerPage);
            $scope.items = filteredRxns.length;
        }
    });
});


angular.module('app').controller('reactantInCtl', function($scope,$stateParams,sharedFactory,CompoundDataFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = 25;
    $scope.maxSize = 5;
    $scope.img_src = sharedFactory.img_src;
    var reactions;
    if (!CompoundDataFactory.compound){
        CompoundDataFactory.getCompound(sharedFactory.dbId, $stateParams.id);
    }
    else {
        CompoundDataFactory.getReactions(sharedFactory.dbId, CompoundDataFactory.compound.Reactant_in);
    }

    $scope.$on("compoundLoaded", function () {
        CompoundDataFactory.getReactions(sharedFactory.dbId, CompoundDataFactory.compound.Reactant_in);
    });
    $scope.$on("rxnLoaded", function () {
        reactions = CompoundDataFactory.reactions;
        $scope.filteredData = sharedFactory.paginateList(reactions, $scope.currentPage, $scope.numPerPage);
        $scope.items = reactions.length;
        $scope.$apply();
    });

    $scope.getCompoundName = CompoundDataFactory.getCompoundName(sharedFactory.dbId);

    $scope.$watch('currentPage + searchOn', function() {
        if (reactions) {
            var filteredRxns = CompoundDataFactory.filterList(reactions, $scope.searchOn);
            $scope.filteredData = sharedFactory.paginateList(filteredRxns, $scope.currentPage, $scope.numPerPage);
            $scope.items = reactions.length;
        }
    });
});
