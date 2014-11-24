angular.module('app').factory('DbChoice', function(){
    return {
        dbid:'KEGGexp',
        where:"home",
        quickSearch:""
    };
});

angular.module('app').controller('resetCtl',  function ($scope, DbChoice) {
    console.log("reset");
    DbChoice.where = "home";
    $scope.startGeneralTour = function () {
        var tour = new Tour(generalTour());
        tour.init();
        tour.start();
    };
    $scope.startMetabolomicsTour = function () {
        var tour = new Tour(metabolomicsTour());
        tour.init();
        tour.start();
    };
});


