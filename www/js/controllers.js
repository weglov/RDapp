angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})



.controller('rowCtrl', function($scope, $stateParams) {
                      $scope.item = $stateParams.item;
                    })

.controller('scheduleCtrl', function($scope, $stateParams, $http, $timeout, $ionicLoading) {

  $ionicLoading.show({
    content: 'Loading',
    template: '<i class="icon ion-loading-c"></i>',
    animation: 'fade-in',
    showBackdrop: false,
    maxWidth: 200,
    showDelay: 0
  });

  
    var url = 'http://ritmo-dance.ru/json.json?callback_shedule=JSON_CALLBACK';
    $http.jsonp(url).success(function(data) {
    $ionicLoading.hide();   
    $timeout(function () {
    $scope.items = data;
  }, 100);

    }).error(function(data) {
        alert("Перезагрузите приложение")
    });  

    $scope.toggle = true;
    $scope.doRefresh = function() {
    $http.jsonp(url).success(function(data) {
        $scope.items = data;
        $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.isPn = function(item) {
    return item.node.field_day_1 === "1";
  };
  $scope.isVt = function(item) {
    return item.node.field_day_1 === "2";
  };
  $scope.isSr = function(item) {
    return item.node.field_day_1 === "3";
  };
  $scope.isCt = function(item) {
    return item.node.field_day_1 === "4";
  };
  $scope.isPt = function(item) {
    return item.node.field_day_1 === "5";
  };
  $scope.isSb = function(item) {
    return item.node.field_day_1 === "6";
  };
  $scope.isVsk = function(item) {
    return item.node.field_day_1 === "7";
  };

    
});
