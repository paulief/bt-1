'use strict';

controllers.controller('TrackingCtrl', ['$scope', '$http', '$timeout', 'btDataService', 'btTimerService', 'btTrackPostProcessing', 
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
  
}]);