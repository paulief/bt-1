/* Services*/

var btServices = angular.module('btServices', []);

btServices.factory('btDataService', ['$http', function($http) {
	return {
		getAllTracks: function(setDataCallback) {
			/*$http.get('locations.json').success(function(data) {
				setDataCallback(data);
			});*/
			
			//leaving out callback since local storage is not async	
			var allTracks = window.localStorage['allTracks'];
			if(allTracks) {
				return angular.fromJson(allTracks);
			};
			return [];
		},
		saveAllTracks: function(tracks) {
			window.localStorage['allTracks'] = angular.toJson(tracks);
		},
		newTrack: function(trackStartTime) {
			return {
				id: trackStartTime,
				startTime: trackStartTime,
				trackEvents: []
			};
		},
		getLastActiveIndex: function() {
			return parseInt(window.localStorage['lastActiveTrack']) || 0;
		},
		setLastActiveIndex: function(index) {
			window.localStorage['lastActiveProject'] = index;
		},
		setActiveTrack: function(track) {
			console.log(track);
			window.localStorage['activeTrack'] = angular.toJson(track);
			console.log(window.localStorage['activeTrack']);
		},
		getActiveTrack: function() {
			var activeTrack = window.localStorage['activeTrack'];
			if (activeTrack) {
				return angular.fromJson(activeTrack);
			};
			return {};
		}
	};
}]);

btServices.factory('btTimerService', function() {
  return {
    startFunc: function(func) {
     this.timer = setInterval(func, 5000);
     console.log("timer started");
    },
    timer: {},
    stopFunc: function() {
      clearInterval(this.timer);
    }
  };	
});

btServices.factory('btGeoService', function() {
	return {
		getLocation: function(callback) {
			var onSuccess = function(loc) {
				callback(loc.coords.latitude, loc.coords.longitude);
			};

			navigator.geolocation.getCurrentPosition(onSuccess, onError);
		}
	}
});