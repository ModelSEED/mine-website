
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
    $scope.numPerPage = 50;
    $scope.maxSize = 5;
    $scope.img_src = sharedFactory.img_src;
    var top30db = "Expected";
    sharedFactory.dbId = 'CDMINESEED'; //Set to the Chemical Damage Database
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
    $scope.parseInt = parseInt;

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
    "R003a745611ea8e92d617ab86a61084ea09d62ce9",
    "R0096783ea7beecdeefcc02085ee173de65e7ee5e",
    "R00980018eac9eb66e224c895c96443e1dce1a139",
    "R01fd9e6e79244a30e2031cc903ea2e62481c6d68",
    "R02dd478296897f15158c69e24a555bd76c6f46ba",
    "R03b4215a252dda66379dee132e8ec81a92a3ab74",
    "R0476accf8c53f9af6e33d45146f8a7ae05017fa3",
    "R0487a4f32581a2c768c9bfa832ba2781fcab0223",
    "R06bac769cd02961d4cac2508118a7a4c6d2cf846",
    "R09370b94918710da8b101587db28ae003555fe07",
    "R0af08a0689294b03ed6cd6511ddb0bf49b206217",
    "R0b476109589e4fb306804b6ab487750202952f7c",
    "R0c093df5eca8e806295e60b84dd0ffda2e2254eb",
    "R0ca695cc2cc1a2082d05ce1ee719742ee938c799",
    "R0d0642fa0123ac476a2afceae042e81967e9d61e",
    "R10bc615ce35b01be0c06699cdc119288ac086e34",
    "R147f12945364c2250ae36d907d2cf7fffc448b67",
    "R15dde42baccb88e3f19b970ca558eece1e8a5f52",
    "R176450cd0b2ded9d00ae38d2fd66a31e8f41919e",
    "R17a5c493006819b1b964d8643a88e658d58ea260",
    "R17b07bbc19f54370eb636862f17cb24a52519426",
    "R18888e135bf3610975c7815418c9063c3180ddbe",
    "R19be239b21b0a70cc95cbd89be3d7ad54456ad18",
    "R19d80e3bfdabae0cb8407ae300f61b45969a8d8b",
    "R1a9b64aa6c021f47d9de3b4615456434978d01fc",
    "R1ab115e86514401b3fe647f4512a50fd9097d85a",
    "R1b8b80d984f965d1251a754d894f3ebb16402088",
    "R1d192c4aabe0ffe2cc75e459734bfe472a68157b",
    "R1fbcc1ee1fd6ba65e0fb3074fbdfb79f5ba1652b",
    "R1ff371f2d4f1d3f3ddbb56e89a44777d048578eb",
    "R23665f69af5875a928a55e9e8efd79b83d874439",
    "R23f038b50c698900dbd03829b811f77e28cb1fd0",
    "R2451781209c99a9e0e283cdbbcdfb2d84b928fed",
    "R2543ec5b2a4dea3fc3ef93346189b937f39a8512",
    "R257428a0940a261220652b9fa254e8606af94d29",
    "R26167799fb2555b9d0b1f46f29195c1ecb020f98",
    "R2736a05c39897c76137f0e62b6a7a5c7c65498ad",
    "R285a1fb6021e1275585e65461ff279d83c9ec1fa",
    "R298ccb629f886d91901534fdb6aa354b8f0cead5",
    "R29af44b7accd7afb1881fe7790187d4250ea2443",
    "R2a5b9cac2e51f27d70f7797e82648de237fafc5c",
    "R2b2ea1888e12550ae843e169e4363f1577f9b164",
    "R2b2f6640f4661409adf8a81d32ef3341a5d580ed",
    "R2d77cee078bc25aa1b53895ae1972e51d879ba36",
    "R2db1d21eefaec5458ef9068a79241a4d74f12811",
    "R2e948f5648fc239e35ec691787422c27ad7eb0ad",
    "R2f58cca87445881d3cd789bd0b5edf7d855dffd6",
    "R31820b24baa1929816c5b46262bc9a973419cbff",
    "R31b068edf5e2aa9b0cc5256b3215871330e381e9",
    "R32fe238d10a7f3bf1a0dd5f9b12cf29d1e1e3772",
    "R338256e70872daf18913b671322e9910b364351e",
    "R3487eba81150c06fbf079fd2bd325785789119c0",
    "R354e3474443114511b48777d6e1d762dfaa46522",
    "R3922bd1520b70343367cac677d1ff584bdf062f3",
    "R39e80e6ac0140ebc34b04b1c40dc63ea4b9ad8e5",
    "R3b2c9e588e6b7b294e838198111cccc932e07e7a",
    "R3bf14013864b0de1b2d897bc0a3a22312fed8441",
    "R3c2818357f2b69e610d46b60ae10e06b7ac7e1a9",
    "R3e294781b169e7ac8e11a3a6e5f62f20ada52534",
    "R3e2a41a6c5381b60577639f5549bbe889dc7f237",
    "R3f56ef2a9dcffdbf143bc6566f85b41fca53059a",
    "R3f619dadb67f19e805edfda798c0b13dd6cf75dc",
    "R4104d351c67d1f0b98257d2589203da6aaec3b4e",
    "R41b51a0534e22aa98bf1ad9ed29fde9c1e6f2043",
    "R4335a723e93f3b53fdd10af2d4586ca05c22d524",
    "R434ed5c3c0b633afb57632ff7ab9b9d96fa9ea20",
    "R44dec1adaca5d609a3bda6eaa08dc3c99e7cc914",
    "R46db0216cdab0e44f6fcdcd98433a3de3c4cc550",
    "R47d46dd835f712e2dfbf78672c0419c5c390c087",
    "R486d2419822deea501cb615317282aa8a6265515",
    "R49f90071f5258cb0af147d2c83461a290e4d7a73",
    "R49fa520d52f6a3e4fa097fbf5de7cb52066c6ab4",
    "R4ae651a3ff9a8fbee8c5bcca222d03e54ae1cca7",
    "R4b1432b1e789309d1a4fd5509cf6b83e062c45b2",
    "R4b2a069b3bb853495350fb492f51578e70e3b947",
    "R4b52cbceb48fa2d8f855d33b1ca8c65d92af691c",
    "R4b7a0e4a57f281ac01b73f56b55b385000c353f4",
    "R4b89f4f9ccc1e443d8759cb0dd7549186cc7ae6c",
    "R4d87acafc5f81e3e916b8f25e2aa7ed691df3305",
    "R4e9bb2d31b85ea30fdfc49094adb8e8817d60a22",
    "R4fc6487b0989e79f343c89ea35a1eb9712570c36",
    "R4ff139af4935c6143f8b2f4374bb246c9fc8c769",
    "R50158c3286c21c174cafc569fe878d76b9e52152",
    "R50496693b2e134484aaa5a07d0ef20c7bd551c7d",
    "R519f5dc888d43ba8d0c6eddc048f27184bc2e267",
    "R51bbabf5c4a8cbaa33662d9fbac7f42afa5c1ca7",
    "R52cf75ea3823892644dddb5a558bb9b175b094e8",
    "R548c3d54d079c55ea5a3f1447ea4d0653f0f513f",
    "R56cb2391fa16fdf536e304a37069ecef30d33aa1",
    "R5732bae03e717a1acff0887d86f534981e61abb6",
    "R57ad0a3a8a510c4a4302d281b4f1228ae0d46044",
    "R586493281f734e693811d2769cd48d0958fb56d4",
    "R5ba8fa4b8a215e81634876b17320e5aa796a5e30",
    "R5cbb04138424846ddf99efa74e00ca76fcb832df",
    "R5e8a222ac520a8f1e95082bcf2435ea24bc0c655",
    "R5ff2e4411c09e246cd3871fd4f9278406da34860",
    "R625208a26d90dffb311430433fbb16d69265b289",
    "R62fb70541c5c9db4427ce0b99bce5375c3f7adfb",
    "R6443f2a4d3a23d705bacad1c2240c0333e5d8c8c",
    "R67bddb7e762d7c770298713e04a6b0f39600a8bd",
    "R67c57a2a4e6c16c6fdd1ce52a9c7cae36b34ad17",
    "R687572be5857328d28627e012d57756be9595f50",
    "R68bf078fd2a78497e8d57bf138b4f9039df08a03",
    "R690f673ce6cd9ee169c993c32b871cd5d32f0562",
    "R69a98728861f6ffbce31b6b6a9f3b5c876fa8b80",
    "R6a1477f65f7d6df24d54b168f8ffc995e1f531d9",
    "R6ac00556716758e03090d27e4e0fa48efa97a718",
    "R6ae78a54f5f76b7bcfae3f16e616fedb5d1e4a63",
    "R6d8c2033ff475dc3b2866194753fee2a45884f24",
    "R6dbb0e5106d0b63f46801d32684711a986a309d4",
    "R6e88d5daf1cbceb4e69c158b2e4bc863757226ac",
    "R6ed983184413869af94a695a7b37064fca48b7a2",
    "R6ef0ccbb8dcd79043e4ea02f151bc28291969030",
    "R71b859702a11b90e6525d83267198aa7eb5b3b99",
    "R725fe96ae5a37294349c594e71aeee73a073c1bc",
    "R7283247a5ca6b8cc244bb83444bfdfefeb88b5e3",
    "R7425bd173f367297353d82019c342fce31a4f4e8",
    "R746e0dfdf2b2e3c6aa554ad2cbba42f66cfc1bd4",
    "R75280de2e50b215fb81ca8e83015f7cc2d5e1d22",
    "R7581d6bf06a362b68a4162e372a27d0a20aaaf61",
    "R76d263256b68eaa5673880afb9019bec340850b6",
    "R77f020e1209c1e338e65df152a5b990571eacabc",
    "R78a8c2e3a74c03cfb82804949943e4d829ecdd56",
    "R78c8647bf4c6c5fe887bf16a8ee3a39eb6ef5b58",
    "R7977fa10f8fc7a1b097ca1606f37348229ee85a3",
    "R7a3d60aa711762504213d287f309af1d19a899a3",
    "R7a61225382510404658145c98036f11b4b2b4824",
    "R7baed24ed5a690b9e5731ddc9568d6068da9a80e",
    "R7bbf9830fd015c453364da8ca5881de1c0ffeb48",
    "R7cdaa3738da461ef09e1abe45e44a6fba5b68c0a",
    "R7d82eeb924a25088f540a8d834a2730a78a4fd0e",
    "R7e99bbeb1e8554325cbb698f5cd13ff2fc2bb675",
    "R7ed2cf5d5c4df5ff59a1ad60fc2accd7f951e6df",
    "R7f2cc9dd2e6256d0fbc1ffb1a8ad7a5c0dc24cc7",
    "R7f30c2294ed9a3e0e495134439d26944b6dc03f5",
    "R7fe4b36ab6b7bbb62b3915f65dee1e9bce29ec61",
    "R8013510db8be01acf23f76563e08de72e1d7bf20",
    "R8050381c7d6e056f534e40e460c26971688eebf3",
    "R81145c95801ce0a69c9034275ea247b68c77c86c",
    "R81a9cc92a1323e1cec6b681dbbe3656ba5cc02c3",
    "R82bd59c159d5c089279c5717ce2936831b08981c",
    "R82f0f26b651873f042bde047bfe7a26418e85838",
    "R85a8be2991f580c8fb0a3cdb58a5dd15d0027457",
    "R86747e6ecf9b0ae308d081b16a40ae9181e481bb",
    "R86860c7d079233f8789fe6d92a6348f45fedb4d6",
    "R86c62935c7f11686f18e2ab03a1a494dd24f63c9",
    "R874fa889c748521defed31b86325b5fa22ca5bb3",
    "R88ba28c153755fdf706060d685a8df99ddc32e8a",
    "R895694b01df4c2118081edc2624cd96454538840",
    "R8b1d5726f8c06751fbd5c4fab7a805e3b31ee092",
    "R8c3111de1a0002e8496252d244cd52dc852a9edc",
    "R8d95b60e3852580e6a911b5e937a17fe293de56f",
    "R8eb72b753431d647b9989155d24052e2fbc5b7ea",
    "R8ec9f33ec943a0e0a1c2b4f6a74f10776e34a36c",
    "R9159b7d239a5e58cc8f944075f32a657dc254e36",
    "R92b1f6c33a2c4dbf601c9116d5b662d709bbff5a",
    "R92ea53f017a2ec94449c428f5053b70234674e93",
    "R946d09d63ce9d69d6d09fda2cde433d370fe821c",
    "R95369d1e63a4c62cb0c1ecb2661b1c183cc57d8b",
    "R959555aa53f43f8c1b622eac78550b8d367a341e",
    "R962e9c6422d6a8b564330ed93fe291ff67b0a35b",
    "R983839dca862a9ca714ac147484ff442e74f04f6",
    "R98bf9fbfb70a03fe62e57bf93b485821f5e20409",
    "R999249edfe9caa3bbc374b5d80bd3eebb35fef28",
    "R9a734d0d2b1aca18e1eb3ee7757253f4961a6aeb",
    "R9b1d3a313ccb130ac7be1e1cc1d7ad22e2d827cf",
    "R9ce977ddceb57d0febc7695779f25a0093c88dd1",
    "R9cffcdac5c5670e7cd38028f3f2816867969152f",
    "R9d349f5035a1715b5b8cd5fabcd1a17bccf93c53",
    "R9d6f21696d0494e5e5e5a13527a4191bd49f738d",
    "R9d798f2c3c1009ccabb50a07d6f915d59f1e8209",
    "Ra01f712f84d5f5d7a759b51698b625c1688553b6",
    "Ra0fa32828261e5db5305a357921604337715ecd9",
    "Ra10c33f38a15fc3af098f516e5d761ce3dd018e0",
    "Ra20c87fa3099d0749ee77092585f4f1b523f5ebf",
    "Ra2a10a433f81ce4e2d8fa06dd212d5161f643b36",
    "Ra2d92851c2416d66074f363aed0a94ac8e8a2250",
    "Ra399f41cdc772c82a9e747d9151aa9f6f9d181ba",
    "Ra5278abf7c3ff73fa63634f6188562a3305cd420",
    "Ra628ca0d14ab0f205fcd2bed87dca25e076afc82",
    "Ra650d45851d170ca296fea185f1106fe094c35e6",
    "Ra87eacd23476af8163633a21b964ab2c5eed55cd",
    "Ra94dc4121f52cdbe38d2c0f786c7a9a4a7f2421b",
    "Raa25e8888e8d9e2bcea06a9d25ce8bcce42ad307",
    "Rad073f3729e57f0911295878363c401024278506",
    "Rad8da22f1e4a9918f40d1361aa1dd34d20d3dc68",
    "Rae0c6a18494fa7e60c0aa7b8168f7cbefbcd7ca5",
    "Raeea25cd1bba325f6cbd7e6169944d5294ab1d7e",
    "Raf0a741f1e5ccfd6c93efffbc5a594d0de83f3cf",
    "Raf61912cb746867b09e711f108c4936294aff257",
    "Rb063ae54b7d0de9c7338c6aa944b7fb3b46fa70a",
    "Rb4bc9600efed02ca72d1d09723cf70b9c117c730",
    "Rb51bb16c965ea368838fbee875bada680d52596d",
    "Rb528151c9e2c005814d547c4f927e17463a4ad49",
    "Rb532902684f68b9e29494f0bd87bda4e8b319540",
    "Rb82dd68c7d23ab1300efa9dbe58cc39775bfa43b",
    "Rbb00343dd3f039892f8813777de8efef373271dc",
    "Rbb6baf81c3f05fe5aa69e6dbddfc6e825207fa92",
    "Rbc8badd6e3d10660c75c44f59d08b74e0f4694fd",
    "Rbca8379cbe213960a8131a3a61a276241f8c904b",
    "Rbce39eaa62bb7d27febb03d6de933e73563e3fc7",
    "Rbcf8690a6117a2f1b505fa347e4b0f836c8ba077",
    "Rbe8f63be68dc8bb6e254d1e7d235c046ccdcb247",
    "Rbe9a4c0cc74c67df328788ae967936dde19be35e",
    "Rbf24d5b29e0905c9bb3bfe2bd1126061bd674d6d",
    "Rc11862be0133636f4ba81228df43175729adb945",
    "Rc11a5d1d7a24c3f0d0717dbb21d6be9927b8f5ba",
    "Rc22714d9fff22308065bcfc04f10c1c16c0be761",
    "Rc375a00a0e30bb630065e18a58c19061997849ca",
    "Rc4bb1f52c4984aeb28b922f6f14afc936aa8bcb5",
    "Rc4e9bd624f6c3429911244abc7953d16e1b189c8",
    "Rc58755d611c73165668c80c33173b5011f599d06",
    "Rc6bc1b96a73904e4643fa8868aa3dceffd41d30d",
    "Rc6f042d7128a29bdaceb7def97e6ae198498abe0",
    "Rc7046b2e80862bbfc6dd9363cee68659c336a633",
    "Rc9f116d338c1f3ac0352acc3e8ad20b92cf3e42b",
    "Rca326ae8ef756a80ef2a8535bcb0b663bc6753e5",
    "Rca7ad9a71cb445e401f647b117b6730d8fb51ce5",
    "Rcb11311b7d1154f3fe8950a5c6a5ed997719ba2a",
    "Rcc6f33026d799e264e226adfc01409cfd7d99f47",
    "Rcdc65e7b79ad0b8307a4f0022c22d281a8ecdef8",
    "Rcee670412dfe6ae7f17e2ac0693874741ad2215f",
    "Rcfba69aaaeefdcc712e9ebf3229b2fa6cef5205c",
    "Rd1af9578f437522784628e629c8b94aefd956374",
    "Rd1e3b7403a716b2fa1e8ea6385bebb12a5ccf184",
    "Rd2ea2f1a4ede546bc5e17bc9aa2bd88ab73b8862",
    "Rd40d705d2dce3412ff3fb7d48f2d1b9a062891e9",
    "Rd480963d86e73b369c700ddc24a173fb1c4e9f67",
    "Rd5e8a8aef5b0fb2c3c3a6578ee082f40c7efe607",
    "Rd6224ef4959c89fa8722d337dc8b31b0072b18d9",
    "Rd8401c08092cc40c98572544a68bb5d3586d25bc",
    "Rd8aebadf74fdb46576abd1e5e658ded4308b07e2",
    "Rd9f257fe76bf93d2b0ae6e3fc799b230182a246b",
    "Rdbe6de64bacfc691336e57586f8c1d2872ba1397",
    "Rddc670e5925be14c589d7ad1cd959877d4933cdd",
    "Rdf34414d322f910b9fec1c3b18c9c3258594c069",
    "Rdf5a92408f8b8f95895bbf25288d506e0a563654",
    "Re1ac337db75f6ee5b40097b2da814d60fa0b9cbb",
    "Re1c6795e39d6e8f17c1a20db01234c44d13df6c2",
    "Re2385055b9b4be39825cefd6c04a7f6beef28371",
    "Re2b3064950b138610aeed3390e26a700a9a8bf36",
    "Re2c069b2902eff4a6472fc32a637d6a888ea7689",
    "Re38bc968f406b7f1311cdc738f28282bc10aec96",
    "Re40389c823db26560a4bb4de792eaab8c1387360",
    "Re5be63e936cad74b8a063afe8e1ee6a2729a4fd2",
    "Re6033120c5ebbeb517e787caaec457cff406e11e",
    "Re686edd16757052d38c9972a1462febd59950bc3",
    "Re83baf9ea2aa17f103cab95e7bb86a814a60b43d",
    "Re84f9d31d5519955092184a7e02d9d4daf7343f0",
    "Re8e811c1bf7445ba8ec2a55612bcc756ccac9035",
    "Re95df25fc60cf2443b9c700d49d5a5c595193215",
    "Rea9d3eed007367406e4a405d7dba473278523342",
    "Receeb0e001114482b0a7750e49a6a7776fe24f60",
    "Reee00fb49dc5be1311837854563d1df3e75d7436",
    "Rf199771ede8ce97fe0e5c7bbb57a0662222b5606",
    "Rf1d18225264a215095d9bf76d855099056446e8e",
    "Rf37ec9d8bb80663aa73a3aa43b599d0b255170e7",
    "Rf4df6d568e1208aade49f6f0a236e0554cb13d9c",
    "Rf4e8a4ebb498870a96b12992fdb60661a82b282e",
    "Rf55c7456365cc1c65b4a56ebe1065d596482b8c1",
    "Rf6e2e7d5b71da90b57f3b2b57c1a58e1afe1665b",
    "Rf6f65583418306244edc16ab95b231bdc495140e",
    "Rf725123673010d4f6b7f1586ed6c4452c0bc5b3e",
    "Rf79d4af225ba574717274f040e23aa90eb077c0c",
    "Rfca357c3eacfcce3bbf03584e352f5c26ae4a4b5",
    "Rfe22c8637e78f6b280c62c0537707b57ea340a05",
    "Rffc7ccefae1f1212f4f54d90cb707b217fcd2879",
    "Rffd0b261ebf6a0a0a01ac4d8a9f8dcbc73b42ceb"
];