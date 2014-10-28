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

.controller('scheduleCtrl', function($scope, $stateParams, $http) {
    var url = 'http://ritmo-dance.ru/json.json?callback_shedule=JSON_CALLBACK';
    $http.jsonp(url).success(function(data) {
        $scope.items = data;
    }).error(function(data) {
        alert("У вас проблеммы с интернетом")
    });  
    $scope.doRefresh = function() {
    $http.jsonp(url).success(function(data) {
        $scope.items = data;
        $scope.$broadcast('scroll.refreshComplete');
    });
  };
    $scope.isMo = function(item) {
    return item.node.field_day === "\u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a";
  };
});
