/* Services*/

var btServices = angular.module('btServices', []);

btServices.factory('btDataService', ['$http', function($http) {
	return {
		get: function(setDataCallback) {
			$http.get('locations.json').success(function(data) {
				setDataCallback(data);
			});
		}
	};
}]);