angular.module('app',[]);
angular.module('app').factory('DataFactory', function(){
    return {choice:{value:'This',  db :'KEGGexp'}};
});

angular.module('app').controller('mainCtl', function($scope,DataFactory){
  $scope.databases =  [
      {value:'This',  db :'KEGGexp'},
      {value:'This1',  db :'KEGGexp1'},
      {value:'This2',  db :'KEGGexp2'}
  ];
  $scope.data = DataFactory;
});

angular.module('app').controller('firstSubCtl', function($scope,DataFactory){
  $scope.test = "start"
  $scope.data = DataFactory;
  $scope.callback = function(){
      console.log("here");
  };
  $scope.$watch('DataFactory.choice', function() {
    console.log(DataFactory.choice.value);
});

});
