angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $filter, $ionicModal, $timeout, $http) {
  var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm');
  window.localStorage['data_now'] = angular.toJson(today);
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
  var url = 'http://ritmo-dance.ru/style_name.json?callback_style=JSON_CALLBACK';
    $http.jsonp(url).success(function(data) {
    $timeout(function () {
    $scope.styles = data;
    }, 300);
    }).error(function(data) {
        alert("Ошибка")
    });  
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
        var post = {
          "key": "JD49LujfpCcYNayT_Pp2Nw",
          "message": {
            "subject": "Запись на занятие",
            "from_email": "viktor@scheglov.pro",
            "from_name": "Школа танцев APP",
            "headers": {
              "Reply-To": "ruscheglov@gmail.com"
            },
            "to": ([{
                    "email": "ruscheglov@gmail.com",
                    "name": "My Name"
                  }]),
            "text": "\nИмя:  " + $scope.loginData.name + "\nТелефон:  " + $scope.loginData.phone +  "\nКуда записать:  " + $scope.loginData.style + "\nПервый раз:  " + ($scope.loginData.toggle ? 'Нет' : 'Да')
          }
        };
          // $http.defaults.headers.common['Authorization'] = '';
          $http.post('https://mandrillapp.com/api/1.0/messages/send.json', post).
          success(function(response) {
               $timeout(function() {
                $scope.closeLogin();
              }, 1000);
          }).
          error(function(err) {
            console.log(err);
          });
  };
   // fff


})

.controller('scheduleCtrl', function($scope, $filter, $stateParams, $http, $timeout, $ionicScrollDelegate) {
    // получаем зоголовок
      $http.jsonp('http://ritmo-dance.ru/last_change_schedule.json?type=schedule&callback=JSON_CALLBACK').success(function(data) {
      $scope.timestamp = '"'+ data[0].node.timestamp+'"';

      if ($scope.timestamp > (window.localStorage['data_load'])) {
        $scope.doNeedLoad();
      }
            });



    $scope.loading = true;




    // проверка на актуальность и загрузка
    var url = 'http://ritmo-dance.ru/json.json?callback_shedule=JSON_CALLBACK';
    if(!angular.isUndefined(window.localStorage["items"])){
    $scope.items = JSON.parse(window.localStorage["items"]);
    } else {
        $http.jsonp(url).success(function(data) {
        $scope.loading = 0;  
        $timeout(function () {
        $scope.items = data;
        loadItems();
        }, 300);
        }).error(function(data) {
            alert("Ошибка")
        }); 
    }
// узнаем время загрузки
    var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm');
    function loadItems() {
        window.localStorage['items'] = angular.toJson($scope.items);
        window.localStorage['data_load'] = angular.toJson(today);
    }

  
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

    $scope.doRefresh = function() {
    $http.jsonp(url).success(function(data) {
        $scope.items = data;        
        loadItems();
        $scope.$broadcast('scroll.refreshComplete');
    });
  };
    $scope.doNeedLoad = function() {
    $http.jsonp(url).success(function(data) {
        $scope.items = data;        
        loadItems();
        $scope.needload = true;
        $timeout(function () {
        $scope.needload = false;
        }, 3000);
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
  $scope.is0 = function(item) {
    return item.node.field_day_1 === "7";
  };
  $scope.isNowDay = (new Date()).getDay();
  $scope.myFilter = eval("$scope.is" + $scope.isNowDay)    
})


.controller('newsCtrl', function($scope, $stateParams, $http, $timeout) {
    $scope.loadingnews = true;
    var url = 'http://ritmo-dance.ru/json-news.json?callback_news=JSON_CALLBACK';
    $http.jsonp(url).success(function(data) {
    $timeout(function () {
    $scope.loadingnews = 0;  
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
})

.controller('newsDetailCtrl', function($scope, $stateParams, $http, $timeout) {                     
    $scope.loadingdetail = true;
    $scope.item = $stateParams.item;
    var url = 'http://ritmo-dance.ru/json-news-read.json?nid=' + $scope.item +'&callback_news=JSON_CALLBACK';
    $http.jsonp(url).success(function(data) {
    $timeout(function () {
    $scope.loadingdetail = 0;  
    $scope.data = data[0].node;
    }, 500);
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


.controller('videoCtrl', function($scope, $stateParams, $http, $timeout) {
    $scope.loadingdetail = true;
    var url = 'http://ritmo-dance.ru/video.json?callback_video=JSON_CALLBACK';
    $http.jsonp(url).success(function(data) {
    
    $timeout(function () {
    $scope.loadingdetail = 0;  
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
})

.controller('videoDetailCtrl', function($scope, $stateParams, $http, $timeout) {
    $scope.toggleVideo = function(item) {
      if ($scope.isVideoShown(item)) {
        $scope.shownVideo = null;
      } else {
        $scope.shownVideo = item;
      }
    };
    $scope.isVideoShown = function(item) {
      return $scope.shownVideo === item;
    };                     
    $scope.loadingdetail = true;
    $scope.item = $stateParams.item;
    var url_album = 'http://ritmo-dance.ru/video_album.json?nid=' + $scope.item +'&callback_video=JSON_CALLBACK';
    $http.jsonp(url_album).success(function(data) {
    $timeout(function () {
    $scope.loadingdetail = 0;  
    $scope.data = data[0].node;
    }, 500);
    }).error(function(data) {
        alert("Ошибка")
    });

    var url = 'http://ritmo-dance.ru/video-detail.json?field_refpage_nid=' + $scope.item +'&callback_video=JSON_CALLBACK';
    $http.jsonp(url).success(function(data) {
    $timeout(function () {
    $scope.loadingdetail = 0;  
    $scope.items = data;
    }, 500);
    }).error(function(data) {
        alert("Ошибка")
    });
})