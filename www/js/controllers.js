angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $filter, $ionicModal, $timeout,$cordovaStatusbar, $http, $ionicLoading) {
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
  

  $scope.loginData.toogle =  false;
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
    console.log($scope.loginData.toogle)
    $scope.loadingIndicator = $ionicLoading.show({
                  content: 'Отправка',
                  animation: 'fade-in',
                  showBackdrop: false,
                  maxWidth: 200,
                  showDelay: 100
              });
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
                    "email": "rsuscheglov@gmail.com",
                    "name": "My Name"
                  }]),
            "text": "\nИмя:  " + $scope.loginData.name + "\nТелефон:  " + $scope.loginData.phone +  "\nКуда записать:  " + $scope.loginData.style + "\nПервый раз:  " + ($scope.loginData.toogle ? 'Да' : 'Нет')
          }
        };
          // $http.defaults.headers.common['Authorization'] = '';
          $http.post('https://mandrillapp.com/api/1.0/messages/send.json', post).
          success(function(response) {
              $scope.loadingIndicator.hide();
              alert("Отправленно")
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

.controller('scheduleCtrl', function($scope, $filter, $stateParams, $http, $timeout, $ionicScrollDelegate, $cordovaCalendar, $ionicPopup) {
   $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Don\'t eat that!',
       template: 'It might taste good'
     });
     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };
  $scope.goData = function(id) {

    var DAY_IN_MS = 24 * 60 * 60 * 1000;
    var user_select_day = parseInt(id.node.field_day_1) - 1;
    var today = new Date();
    var days_offset = today.getDay() - 1;
    if (days_offset < 0) days_offset = 6;
    var monday_of_week_tms = today.getTime() - days_offset * DAY_IN_MS;
    var event_date = monday_of_week_tms + user_select_day * DAY_IN_MS + (user_select_day < days_offset ? 7 * DAY_IN_MS : 0);
    var event_date_start = new Date(event_date);
    var minutes = parseInt(id.node.field_times.substr(3,2));
    var hours = parseInt(id.node.field_times.substr(0,2));
    event_date_start.setHours(hours);
    event_date_start.setMinutes(minutes);
    event_date_start.setSeconds(0);
    var event_date_end = new Date(event_date_start.toString());
    event_date_end.setHours(hours + 1);
    event_date_end.setMinutes(minutes);
    event_date_end.setSeconds(0);
    console.log(event_date_start);
    console.log(event_date_end);

    $cordovaCalendar.createEvent({
    title: id.node.field_rstyle + ' c ' + id.node.field_rteacher,
    location: id.node.field_center,
    notes: 'Занятие будет проходить: '+ id.node.field_center + '\nНачало в ' + id.node.field_times + '\nПреподает: ' + id.node.field_rteacher,
    startDate: event_date_start,
    endDate: event_date_end
    }).then(function (result) {
    $ionicPopup.alert({
       title: 'Готово!',
       template: 'Занятие сохранено в календарь телефона, мы напомним вам за час до занятия'
     });
    }, function (err) {
      $ionicPopup.alert({
       title: 'Ошибка',
       template: 'It might taste good'
     });
  });
  }


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
    $scope.loading = false;
    } else {
        $http.jsonp(url).success(function(data) {
        $scope.loading = false;  
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


.controller('newsCtrl', function($scope, $stateParams, $http, $timeout, $filter) {
    $scope.loadingnews = true;
    var url = 'http://ritmo-dance.ru/json-news.json?callback_news=JSON_CALLBACK';
    if(!angular.isUndefined(window.localStorage["news_items"])){
    $scope.loadingnews = 0;
    $scope.items = JSON.parse(window.localStorage["news_items"]);
    } else {
      $http.jsonp(url).success(function(data) {
      $timeout(function () {
      $scope.loadingnews = 0;  
      $scope.items = data;
      loadItems();
      }, 300);
      }).error(function(data) {
          alert("Ошибка")
      });  
    }
    var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm');
    function loadItems() {
        window.localStorage['news_items'] = angular.toJson($scope.items);
        window.localStorage['news_data_load'] = angular.toJson(today);
    }

    $scope.doRefresh = function() {
    $http.jsonp(url).success(function(data) {
        $scope.items = data;
        loadItems();
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


.controller('videoCtrl', function($scope, $stateParams, $http, $timeout, $filter) {
    $scope.loading = true;
    var url = 'http://ritmo-dance.ru/video.json?callback_video=JSON_CALLBACK';
    if(!angular.isUndefined(window.localStorage["video_item"])){
    $scope.loading = 0;
    $scope.items = JSON.parse(window.localStorage["video_item"]);
    } else {
      $http.jsonp(url).success(function(data) {
      $timeout(function () {
      $scope.loading = 0;  
      $scope.items = data;
      loadItems();
      }, 300);
      }).error(function(data) {
          alert("Ошибка")
      });  
    }
    var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm');
    function loadItems() {
        window.localStorage['video_item'] = angular.toJson($scope.items);
        window.localStorage['video_data_load'] = angular.toJson(today);
    }


    $scope.doRefresh = function() {
    $http.jsonp(url).success(function(data) {
        $scope.items = data;
        loadItems();
        $scope.$broadcast('scroll.refreshComplete');
    });
  };
})

.controller('videoDetailCtrl', function($scope, $stateParams, $http, $timeout, $ionicModal) {
      $ionicModal.fromTemplateUrl('../templates/video-detail-mp4.html', function(modal){
        $scope.videoModal = modal;
      },{
        scope: $scope,
        animation: 'slide-in-right'
      });
      $scope.closeVideo = function() {
        $scope.videoModal.hide();
      }
      $scope.toVideoDetail = function (id) {
        var item = $scope.items[id];  
        $scope.activeVideo = {
          title: id.node.title,
          video: id.node.field_video
        }
        console.log($scope.activeVideo.video)
        $scope.videoModal.show();
      }
                  
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