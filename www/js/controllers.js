angular.module('btControllers', [])

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

.controller('TrackingCtrl', ['$scope', '$http', '$timeout', 'btDataService', 'btTimerService', 'btTrackPostProcessing', 
  function($scope, $http, $timeout, btDataService, btTimerService, btTrackPostProcessing) {

  console.log("Controller loaded");

  var currentTrack;

  
  
  $scope.newTrack = function() {
	  console.log(new Date().getTime());
	  var newTrackToAdd = btDataService.newTrack(new Date().getTime());
	  
	  $scope.tracks.push(newTrackToAdd);
	  btDataService.saveAllTracks($scope.tracks);
	  console.log(btDataService.getAllTracks());
	  setTracks(btDataService.getAllTracks());
  };

  $scope.startNewTrack = function() {
    var trackStartTime = new Date().getTime();
    console.log("New track started at " + trackStartTime);

    currentTrack = btDataService.newTrack(trackStartTime);

    //make the new track the active track
    btDataService.setActiveTrack(currentTrack);

    //starting a timer that records location every set # of minutes
    btTimerService.startFunc(triggerLocationCheck);
  };

  $scope.stopAndSaveCurrentTrack = function() {
    btTimerService.stopFunc();
    var newTrackToSave = btDataService.getActiveTrack();
    newTrackToSave.displayDate = btTrackPostProcessing.formatDisplayDate(newTrackToSave.startTime);
    console.log(newTrackToSave);

    var processedTrackPromise = btTrackPostProcessing.geocodeTrack(newTrackToSave);

    if (processedTrackPromise) {
      processedTrackPromise.then(function(city) {
        newTrackToSave.startLoc = city;
        //$scope.tracks.push(newTrackToSave);
      });
    } else {
      newTrackToSave.startLoc = "No locations tracked";
    }

    btDataService.saveNewTrack(newTrackToSave);
    //setTracks(btDataService.getAllTracks());
  }

  var triggerLocationCheck = function() {
    navigator.geolocation.getCurrentPosition(recordLocation, handleLocError, {maximumAge:300000}); //need to refactor this into service that passes back promise
  }

  var recordLocation = function(loc) {
    console.log("Location found");
    //var activeTrack = btDataService.getActiveTrack();
    var currLocObject = getLocationObject(loc);
    currentTrack.trackEvents.push(currLocObject);
    btDataService.setActiveTrack(currentTrack);
  };

  var handleLocError = function(error) {
    console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
  }

  var getLocationObject = function(loc) {
    var locationTime = new Date().getTime();
    var _lat = loc.coords.latitude;
    var _lon = loc.coords.longitude;
    return {
      locTime: locationTime,
      lat: _lat,
      lon: _lon
    };
  };
  
}])

.controller('TrackListCtrl', ['$scope', 'btDataService', '$timeout', function($scope, btDataService, $timeout) {
    $scope.refreshTracks = function() {
      console.log(btDataService.getAllTracks());
      setTracks(btDataService.getAllTracks());
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.selectTrack = function(track) {
      btDataService.setActiveTrack(track);
    }

    var setTracks = function(data) {
      if (data) {
        $scope.tracks = data;
        console.log(data);
      } else {
        $scope.tracks = [];
      }
    };
  

    setTracks(btDataService.getAllTracks());

    console.log($scope.tracks);

    $scope.$root.toggleDeleteButton = function() {
      $scope.shouldShowDelete = !$scope.shouldShowDelete;
      console.log("Toggleing delete to " + $scope.shouldShowDelete);
      $scope.$root.editButtonText = ($scope.shouldShowDelete ? "Done" : "Edit");
    };

    //NEED TO BREAK THIS OUT TO SEPARATE CONTROLLER-->
    $scope.shouldShowDelete = false;
    $scope.$root.editButtonText = "Edit";

    $scope.deleteTrack = function(track, index) {
      btDataService.deleteTrack(track);
    };
  }]) 
  

  

.controller('TrackDispCtrl', ['$scope', '$stateParams', 'btDataService', function($scope, $stateParams, btDataService) {
	console.log(btDataService.getActiveTrack());
	
	$scope.selectedTrack = btDataService.getActiveTrack();
	
	
}]);
