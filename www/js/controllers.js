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
   // fff


})

.controller('scheduleCtrl', function($scope, $stateParams, $http, $timeout, $ionicScrollDelegate) {
    $scope.loading = true;
    $scope.toggleGroup = function(item) {
      if ($scope.isGroupShown(item)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = item;
      }
    };
    $scope.isGroupShown = function(item) {
      return $scope.shownGroup === item;
    };

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
      };

    var url = 'http://ritmo-dance.ru/json.json?callback_shedule=JSON_CALLBACK';
    $http.jsonp(url).success(function(data) {
    $scope.loading = 0;  
    $timeout(function () {
    $scope.items = data;
    }, 300);
    }).error(function(data) {
        alert("Ошибка")
    });  

    $scope.doRefresh = function() {
    $http.jsonp(url).success(function(data) {
        $scope.items = data;
        $scope.$broadcast('scroll.refreshComplete');
    });
  };


$scope.is1 = function(item) {
    return item.node.field_day_1 === "1";
  };
  $scope.is2 = function(item) {
    return item.node.field_day_1 === "2";
  };
  $scope.is3 = function(item) {
    return item.node.field_day_1 === "3";
  };
  $scope.is4 = function(item) {
    return item.node.field_day_1 === "4";
  };
  $scope.is5 = function(item) {
    return item.node.field_day_1 === "5";
  };
  $scope.is6 = function(item) {
    return item.node.field_day_1 === "6";
  };
  $scope.is7 = function(item) {
    return item.node.field_day_1 === "7";
  };

  $scope.isNowDay = (new Date()).getDay();
  $scope.myFilter = eval("$scope.is" + $scope.isNowDay)
    
})


.controller('newsCtrl', function($scope, $stateParams, $http, $timeout) {
    $scope.loading = true;
    var url = 'http://ritmo-dance.ru/json-news.json?callback_news=JSON_CALLBACK';
    $http.jsonp(url).success(function(data) {
    $scope.loading = 0;  
    $timeout(function () {
    $scope.newss = data;
    }, 300);
    }).error(function(data) {
        alert("Ошибка")
    });  

    $scope.doRefresh = function() {
    $http.jsonp(url).success(function(data) {
        $scope.items = data;
        $scope.$broadcast('scroll.refreshComplete');
    });
  };
})

.controller('newsdetailCtrl', function($scope, $stateParams, $http, $timeout) {                     
    $scope.loading = true;
    $scope.item = $stateParams.item;
    var url = 'http://ritmo-dance.ru/json-news-read.json?nid=' + $scope.item +'&callback_news=JSON_CALLBACK';
    $http.jsonp(url).success(function(data) {
    $scope.loading = 0;  
    $timeout(function () {
    $scope.items = data;
    }, 200);
    }).error(function(data) {
        alert("Ошибка")
    });  
})

.controller('aboutCtrl', function($scope, $ionicSlideBoxDelegate, $ionicModal) {
    $scope.nextSlide = function() {
      $ionicSlideBoxDelegate.next();
    }
  $scope.loginData = {};
  $ionicModal.fromTemplateUrl('templates/rules.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.closeRules = function() {
    $scope.modal.hide();
  };
  $scope.rules = function() {
    $scope.modal.show();
  };

  })