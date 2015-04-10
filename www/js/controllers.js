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

.controller('TracksCtrl', ['$scope', '$http', 'btDataService', function($scope, $http, btDataService) {

  var setTracks = function(data) {
    if (data) {
    	$scope.tracks = data;
    } else {
    	$scope.tracks = [];
    }
  };
  
  $scope.refreshTracks = function() {
	  console.log(btDataService.getAllTracks(setTracks));
	  setTracks(btDataService.getAllTracks(setTracks));
  };


  //passing setTracks as a callback
  setTracks(btDataService.getAllTracks(setTracks));
  
  $scope.newTrack = function() {
	  console.log(new Date().getTime());
	  var newTrackToAdd = btDataService.newTrack(new Date().getTime());
	  
	  $scope.tracks.push(newTrackToAdd);
	  btDataService.saveAllTracks($scope.tracks);
	  console.log(btDataService.getAllTracks(setTracks));
	  setTracks(btDataService.getAllTracks(setTracks));
  };
  
  $scope.selectTrack = function(track) {
	  console.log(track);
	  btDataService.setActiveTrack(track);
  };
}])

.controller('TrackDispCtrl', ['$scope', '$stateParams', 'btDataService', function($scope, $stateParams, btDataService) {
	console.log(btDataService.getActiveTrack());
	
	$scope.selectedTrack = btDataService.getActiveTrack();
	
	
}]);
