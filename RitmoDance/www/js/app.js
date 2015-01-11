// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'firebase'])

.config(function ($sceProvider) {
  $sceProvider.enabled(false);
})

.run(function($cordovaSplashscreen) {
  setTimeout(function() {
    $cordovaSplashscreen.hide()
  }, 1000)
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.video', {
      url: "/video",
      views: {
        'menuContent' :{
          templateUrl: "templates/video.html",
          controller: 'videoCtrl'
        }
      }
    })
    .state('app.videodetail', {
      url: "/video/:item",
      views: {
        'menuContent' :{
          templateUrl: "templates/video-detail.html",
          controller: 'videoDetailCtrl'
        }
      }
    })
    .state('app.about', {
      url: "/about",
      views: {
        'menuContent' :{
          templateUrl: "templates/about.html",
          controller: 'aboutCtrl'
        }
      }
    })
    .state('app.schedule', {
      url: "/schedule",
      views: {
        'menuContent' :{
          templateUrl: "templates/schedule.html",
          controller: 'scheduleCtrl'
        }
      }
    })
    .state('app.sign', {
      url: "/sign",
      views: {
        'menuContent' :{
          templateUrl: "templates/sign.html",
          controller: 'signCtrl'
        }
      }
    })
    .state('app.cell', {
      url: "/news/:item",
      views: {
        'menuContent' :{
          templateUrl: "templates/news-detail.html",
          controller: 'newsDetailCtrl'
        }
      }
    })

.state('app.news', {
      url: "/news",
      views: {
        'menuContent' :{
          templateUrl: "templates/news.html",
          controller: 'newsCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/schedule');
});

