// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'btControllers', 'btServices'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.track', {
    url: "/track",
    views: {
      'menuContent': {
        templateUrl: "templates/track.html",
		controller: 'TrackingCtrl'
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
    .state('app.tracks', {
      url: "/tracks",
      views: {
        'menuContent': {
          templateUrl: "templates/tracks.html",
          controller: 'TrackListCtrl'
        }
      }
    })

  .state('app.singletrack', {
    url: "/tracks/:trackId",
    views: {
      'menuContent': {
        templateUrl: "templates/track_display.html",
        controller: 'TrackDispCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/track');
});

var controllers = angular.module('btControllers', []);
var services = angular.module('btServices', []);