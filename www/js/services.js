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
		saveNewTrack: function(newTrack) {
			var allTracks = angular.fromJson(window.localStorage['allTracks']);
			if (!allTracks) {
				allTracks = [];
			};
			allTracks.push(newTrack);
			window.localStorage['allTracks'] = angular.toJson(allTracks);
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

btServices.factory('btTrackPostProcessing', ['$q', function($q) {
	var geocoder = new google.maps.Geocoder();
	return {
		geocodeTrack: function(unprocessedTrack) {
			var lat = unprocessedTrack.trackEvents[0].lat;
			var lon = unprocessedTrack.trackEvents[0].lon;
			var latLng = new google.maps.LatLng(lat, lon);

			var deferred = $q.defer();
			geocoder.geocode({'latLng': latLng}, function(results, status) {
				var cityName, state_abbrev;

				if(status == google.maps.GeocoderStatus.OK) {
					console.log(results);
					//loop through all the components of the most specific address returned
					angular.forEach(results[0].address_components, function(addr_component, index) {
						if (addr_component.types[0] == "locality") { //this is the town name component
							//unprocessedTrack.town_name = addr_component.long_name;
							cityName = addr_component.long_name;
							console.log(cityName);
						} else if (addr_component.types[0] == "administrative_area_level_1") { //state component
							//unprocessedTrack.state_abbrev = addr_component.short_name;
							state_abbrev = addr_component.short_name;
						};
					});
				} else {
					console.log("geocode failed");
				};
				var fullLocName = cityName + ', ' + state_abbrev;
				deferred.resolve(fullLocName);
			});
			return deferred.promise; //now processed
		},
		formatDisplayDate: function(timestamp) {
			var date = new Date(timestamp);
			var displayDate = date.toDateString();
			return displayDate;
		}
	}
}]);