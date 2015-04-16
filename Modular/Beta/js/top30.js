
angular.module('app').factory('top30Factory', function($rootScope){
    var factory = {
        services: new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database'),
        img_src: "http://lincolnpark.chem-eng.northwestern.edu/Smiles_dump/",
        getReactions: function(db, rxn_ids) {
            var promise = factory.services.get_rxns(db, rxn_ids);
            promise.then(function (result) {
                    factory.reactions = result;
                    $rootScope.$broadcast("rxnLoaded")
                },
                function (err) {console.error("get_rxns fail");}
            );
        },
        //Type filtering
        filterList: function(reactions, field, searchOn) {
            if (searchOn && (typeof(reactions) != 'undefined') && (reactions.length > 0)) {
                var subList = [];
                for (var i = reactions.length - 1; i >= 0; i--) {
                    if ((reactions[i][field].indexOf(searchOn) > -1)&&(subList[subList.length-1] != reactions[i])) {
                        subList.push(reactions[i]);
                    }
                }
                return subList
            }
            else{return reactions}
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
                                    content: '<img id="img-popover" src="' + factory.img_src + id + '.svg" width="250">'
                                });
                            }
                        },
                        function (err) {console.log(err);}
                    );
                }
            }
        }
    };
    return factory
});

angular.module('app').controller('top30Ctl', function($scope,$stateParams,sharedFactory,top30Factory){

    $scope.currentPage = 1;
    $scope.numPerPage = sharedFactory.numPerPage;
    $scope.maxSize = 5;
    $scope.img_src = sharedFactory.img_src;
    var top30db = "Expected";
    sharedFactory.dbId = 'CDSEED2'; //Set to the Chemical Damage Database
    var reactions;
    $scope.searchType = "";
    $scope.searchComp = "";

    top30Factory.getReactions(top30db, damageReactionIDs);
    console.log(damageReactionIDs);

    $scope.$on("rxnLoaded", function () {
        reactions = top30Factory.reactions;
        $scope.filteredData = sharedFactory.paginateList(reactions, $scope.currentPage, $scope.numPerPage);
        $scope.items = reactions.length;
        $scope.$apply();
    });

    $scope.getCompoundName = top30Factory.getCompoundName(top30db);

    $scope.staticPage = function(){
        var rxnhtml = $('#rxn-tbl').html();
        sharedFactory.downloadFile(rxnhtml,'reactions.html')
    };

    $scope.$watch('currentPage + searchType + searchComp', function() {
        if (reactions) {
            var filteredRxns = top30Factory.filterList(reactions, "Type", $scope.searchType);
            filteredRxns = top30Factory.filterList(filteredRxns, "Compound", $scope.searchComp);
            $scope.filteredData = sharedFactory.paginateList(filteredRxns, $scope.currentPage, $scope.numPerPage);
            $scope.items = filteredRxns.length;
        }
    });
});

var damageReactionIDs = [
    "R000849ecd933ea7a7cfb491635b0fb915df6026b",
    "R02c1c03ffe077e61e3b06ce8b267225f5d7c3c68",
    "R032fdba500e46fdb27e20081672036d83b7b61e9",
    "R0516be3d6f6f99bba46e9fede9c3da95acdcdf39",
    "R056b20c78bc88e5a289f1fb111b2cd7f1fa947ec",
    "R069ead9ac82ce5e61b1650d9e824ab92c8b543b9",
    "R06e9be82e1c64f19ca5a4f8e511cb995c946b74b",
    "R09370b94918710da8b101587db28ae003555fe07",
    "R0b8256ff72587f2e05aa1c995b325c17d7f9e55f",
    "R0f551569ae4c7196a41c67222bc02dd5bbf5c33f",
    "R1057ce05fe9f4add6ab8415c4d215ed1d3a12b57",
    "R1365d7268b22e6e7257f8468422bb60bd98cfdce",
    "R142994d8a90292e0851225ce33e718e88be64e6a",
    "R1458ba5e7d1871a4363b6b9e12164f9a33f93da9",
    "R173aeb64cf55fd489e233e826667e6449f50d30d",
    "R1c5c0b69f0e3aaa91d56b6d79e734957c479cc9c",
    "R1d8e1e75151354f6d5311a0a53052dc3a163a840",
    "R1dd3b7700cc392d28d68ef6f204659e354d92c5b",
    "R1fdf8d25702e62ad5ef43b09832864d3522ed0bc",
    "R22cd7bc65d99b6f8b11975aeea4a48193a559c0f",
    "R23423ecf8ee6234855ae5ab5fbe2e10327ea084e",
    "R26975af43a789cdcfc9802ea254ab9cf97fbf38e",
    "R270a08e276b191035f01903441f6942130cd13f9",
    "R2786430f23b9edc01b3c53fcb3edcbaabb266d92",
    "R2871b15c7ef5f928f20c8bf57c3557cb8ba5bbda",
    "R288c6158c9f3fa571d87c58a80a8a23cdf0fbb87",
    "R2c419529c9ca30db85891ff544da96723f5a8f6c",
    "R2dc9c81dc702d18c55fa555bf771a84931ad1d2d",
    "R2e47e9b9f58702fd85d0f0e8414f27bccfaca731",
    "R2f28021e7f324f54a51e8ce581664a9f866915a1",
    "R32fe238d10a7f3bf1a0dd5f9b12cf29d1e1e3772",
    "R34a168bcc2bce5ece672cac848c77e6d023b08da",
    "R35f665cd5779e4c6b04f35c8f2bc069149f082f2",
    "R37793963007e083571cbd71dd26bc87fce0c66c5",
    "R39c9b437e4a5742e1fd96da793ea4c94710aa645",
    "R3bf14013864b0de1b2d897bc0a3a22312fed8441",
    "R3e8ac27e51570a576a1b7aa71b964c874fddfe14",
    "R3eefa8cda434a316751dfa3afd197b27deae6013",
    "R3f766d3562d28382f8b69caf35ecd3c25ba31a69",
    "R41eedd6c080471ff7a825ef65ee4aae27569ec9e",
    "R42d345208c5a30b56d7672d8fd3e15d05ce44213",
    "R442da04e97e96d2cbc449762ed2f60a5321ced08",
    "R4493b257ea79aa5e851a786777224ea77d0e646c",
    "R486b31f13aafb9c0cfb057ea02dccb7c015b7224",
    "R493019872332b0768ebddcd64dcb23253f722b02",
    "R4dd4499ef4944d5a4577b7686d1f12a99061d0ac",
    "R512ee65d06e42cac7de2a86cc285e8b5c60bd65f",
    "R53a67a43e35b08eedd047b274a42f1fa751fdc1f",
    "R5731be7442ba4a440f8f1eb77463878bf9ee5eb3",
    "R59046d9b83081185fcbb591a50addeb2829636b9",
    "R597077cff059d6e8a1a2a771349c878084fa3a66",
    "R5b0ffca866d1da3d06a08eaccae89f282789d520",
    "R5b81abd75d46bcdbdd4660e036040232e88ddc5c",
    "R5b9989ab22156241650434a4f44bcef4bd30c642",
    "R5c8405d41a71761ec6d913cfc35f2942289d6540",
    "R5c8eef81c5f073a0225b108e0648d5c007a71ba9",
    "R5d2b5bc607b8a7127fac12e82315b665efdf7acd",
    "R5e88838257e6d6e68e005c24b0ba0c0d37d9316e",
    "R629aac76705e6f67a303ff27544b8527fe5b84da",
    "R63231afffc17c211280efb615940cde81c712e4e",
    "R63d6618f07960399422f8882a7226ef2d8be75b8",
    "R65da495ef09db7ad37874fe5f848de02ff6205d7",
    "R67aaf1288ab61f2cf20705325e686f599961e42d",
    "R6977ba93bd1ab4a4ad8e1ce9be53185e83b6c9f2",
    "R69bf98cc20037ca7adca0c7ce557692db38c405b",
    "R6d482beee6522e1fdb0722f19840a0c157fb5619",
    "R6f49e84954a23ab6cbbef20f9b880c6ea7265cfa",
    "R6fcd513d67f35f1b7236f2b13450c418eae95cc6",
    "R6fefdeb88ce51c5087ac464061b7437bccf52d9a",
    "R751c9e91f9a1bdf6e350419da7c5b0f780d37e06",
    "R7623fdf66b1146476e748709ac451ef36dc605d9",
    "R76d263256b68eaa5673880afb9019bec340850b6",
    "R77f020e1209c1e338e65df152a5b990571eacabc",
    "R7880c8c991a4850502983be968e909f396a8f10c",
    "R78c3608cdc1dec60b59245e1b0fafd9893b375e5",
    "R7977fa10f8fc7a1b097ca1606f37348229ee85a3",
    "R7a2df481e84769969d2181f1052686695c48fc16",
    "R7c45fbf7cfd9c5316c8cd2d51c222ff23ff94907",
    "R7eb3d0104f5e755e0675b6bcc6a681c5f6b8a4ea",
    "R7f370256d8febf84711978ad6e879856472285bd",
    "R8169e7eb5f019c094f7196147dc604e399f0ea11",
    "R8532ee7494d176b37f7c6e90132b3e3e1e1ed192",
    "R8583d5c5fea4d5eec6bcc590449afddc4af8ad66",
    "R874fa889c748521defed31b86325b5fa22ca5bb3",
    "R8d1656bdf5185a7f94284749407fdc393bfbed7a",
    "R8d95b60e3852580e6a911b5e937a17fe293de56f",
    "R8e841a6608ae54a16b427d515e422c69ddb16ee4",
    "R92a0624f1a193900220d93476b375e35a9fa01a4",
    "R9b036bf1f4d962f193d911b6270165d5d2b73b88",
    "R9b5536ca5c2c273e7eccd518b638351faa122977",
    "R9cffcdac5c5670e7cd38028f3f2816867969152f",
    "R9d8bf0c561cbfcb9cb1391c5e31be7b4106d318d",
    "R9e2a9e78d28b707f3b6d1014bb74dcca4051e147",
    "Ra1280e2ab2b4400b23879cc16075ae3c8ce94380",
    "Ra5411712212c2c953e8f3238d2e935c08e233c60",
    "Ra5a1c7724af82ec80e5f44561676f512413d4eae",
    "Ra6d876b082b710809e162973a564fcf44e38702f",
    "Ra7df414be25e6449bccf5d83ec77aa61c993f6c6",
    "Rabfc510914a4799d26ab00e740aed01ba70ce477",
    "Rafa334515d0cd4be8964e3b83f5097711e2e7ebf",
    "Rb05b71d6d95a6e0290f81fe997dac5390c151ae7",
    "Rb0d47ff30eed500105f1e6de85760c709872099a",
    "Rb0f89a942b96b9e9ace2ab9f6fe8be311a9e603e",
    "Rb13843784acd0a731550fbad4973263df413286a",
    "Rb34846dedcd0dce006f50d3921ef2b1840ad4390",
    "Rb6d9676a5c2f047f554133f4866182f3025ab2ab",
    "Rb7363f105ea232332c482a40476f601c25b26446",
    "Rb8a41c57ef804e91ff2593c02fe36ed9588dd527",
    "Rb9ba0043972096090eafe736f8c6234b1dc2df99",
    "Rbbe6afb761684f83772354f93b16baed22f06a4b",
    "Rbc4e016bfe393e9de120297bc75f01358dd54884",
    "Rbd4b0e915fb8f2eb81d14a0295d02c08ef648e78",
    "Rbe8f63be68dc8bb6e254d1e7d235c046ccdcb247",
    "Rbe9282380627de5444702e439862b8ca281d83a6",
    "Rc2207b5f64682b5be10faa9c39901f9ee390ccb2",
    "Rc3585b05e3ebe7d0c8e795ed4495c11bf7cab568",
    "Rc3b170e7589cb7437db7501a39c0fe12b47cf5e2",
    "Rc4bb1f52c4984aeb28b922f6f14afc936aa8bcb5",
    "Rc93b872771162efc6d0aa5508f64b65c50b35155",
    "Rcad5f34d202c912d3fd656b48a92043382d84237",
    "Rd2aa064353add0e44aeba4edf624f014f7bae00b",
    "Rd368d9104310e6bf8dd3e464ef76bd111374de9c",
    "Rd65e1af622c085c9ec31b447c1063678464aeac0",
    "Rd6d9ca79b6008db0a1da631e47ba92d2109871aa",
    "Rd84109e2327ddbf4621fed7ceeaeb8604a0c0539",
    "Rd923aa4b71734972881a530cda825fad4cfed6c4",
    "Rddc670e5925be14c589d7ad1cd959877d4933cdd",
    "Re0bf39fe9d3348ab66c177a46658f26c3556263e",
    "Re1ac337db75f6ee5b40097b2da814d60fa0b9cbb",
    "Re284b0104e1954a4d1c6f30993be89e9202f56d8",
    "Re2e1ebc3d711ef25563c063f2918fed0440ebca4",
    "Re33d9445326a5bdbfe1c1f22c6d9d0ef42baf636",
    "Re42d089b3e555be33a4528bedbaa3bfa0a464a97",
    "Re62c3482ae75d764605d22a64f85b79e52bab07b",
    "Re6487243440baab16a44745d72dc2c7efbcca37e",
    "Re8af02b013834242fad8a0afa89cbfe40d2eba50",
    "Re8e811c1bf7445ba8ec2a55612bcc756ccac9035",
    "Re99f3f1bc4c8d87fe951b3bc509da15b07690eda",
    "Reb879e2a4c083e3f16aab15a8990bb56933458ad",
    "Ree8be12e39320d1a77b4a0537095041b7e733ab4",
    "Ref732ccfe8aab478342064b5f0615af7d95fe903",
    "Rf1bfc3db268d53c68c6a2909fb496d70f13f7a3a",
    "Rf37ec9d8bb80663aa73a3aa43b599d0b255170e7",
    "Rf4c8c5fb59002b85cdceb421f6cbbd2d3177e324",
    "Rf591e76c5614a64a7345dc011157b7d3b30b45ff",
    "Rf7c8bdf890d2ef1269bbe411b310cfa193f33e73",
    "Rfb9932bb2ebc829ffb7e63209ed6aea9f1694a37",
    "Rff1847db7852bb2eae17ef13c51a3ce4ef348bbc",
    "Rffc7ccefae1f1212f4f54d90cb707b217fcd2879"
];