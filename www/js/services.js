/* Services*/

var btServices = angular.module('btServices', []);

btServices.factory('btDataService', ['$http', function($http) {
	return {
		get: function(setDataCallback) {
			$http.get('playlists.json').success(function(data) {
				setDataCallback(data);
			});
		}
	};
}]);