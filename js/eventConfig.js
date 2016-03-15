var eventApp = angular.module('eventApp', ['ngRoute', 'eventControllers']);

eventApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/login', {
			templateUrl: 'templates/event-login.html',
			controller: 'eventLoginController'
		}).
		when('/events', {
			templateUrl: 'templates/events.html',
			controller: 'eventsController'
		}).
		when('/events/create', {
			templateUrl: 'templates/event-create.html',
			controller: 'eventCreateController'
		}).
		otherwise({
			redirectTo: '/login'
		});
}]);