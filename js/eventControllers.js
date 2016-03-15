var eventControllers = angular.module('eventControllers', ['ngSanitize']);

eventControllers.controller('mainController', ['$scope', 
	function($scope) {
		if (typeof(Storage) !== "undefined") {
		    $scope.user = localStorage.getItem("eventApp.user");
		}

		$scope.$on('login', function(event) {
			$scope.user = localStorage.getItem("eventApp.user");
		});
		

		$scope.logout = function() {
			localStorage.removeItem("eventApp.user");
			$scope.user = null;
		}
	}
]);

eventControllers.controller('eventLoginController', ['$scope', '$window',
	function($scope, $window) {
		if (typeof(Storage) !== "undefined") {
		    if(localStorage.getItem("eventApp.user")) {
		    	$window.location.href = '#/events';
		    }
		}

		$scope.submit = function() {
			var name = $scope.name;
			var email = $scope.email;
			var password = $scope.password;
			var errorMessage = '';
			
			if (!validateEmail(email)) {
				errorMessage += '<p>- Email is missing or not valid.</p>';
			}
			
			if (!password) {
				errorMessage += '<p>- Password is missing.</p>';
			} else if (!validatePassword(password)) {
				errorMessage += '<p>- Password must be as least 6 - 16 characters, contain at least 1 number and 1 special character.</p>';
			}

			$scope.errorMessage = errorMessage;

			if (!errorMessage) {
				if (typeof(Storage) !== "undefined") {
					if (!name) {
						name = email.substring(0, email.lastIndexOf("@"));
					}

				    localStorage.setItem("eventApp.user", name);
				    $window.location.href = '#/events';
				    $scope.$emit('login');
				} else {
				    $scope.errorMessage = "Sorry, your browser must support Web Storage.";
				}
			}
		}

		function validateEmail(email) {
			var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return regex.test(email);
		}

		function validatePassword(password) {
			var regex  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
			return regex.test(password);
		}
	}
]);

eventControllers.controller('eventsController', ['$scope', '$window',
	function($scope, $window) {
		if (typeof(Storage) !== "undefined") {
			var name = localStorage.getItem("eventApp.user");
			if (!name) {
				$window.location.href = '#/login';
			} else {
				$scope.name = name;
			}
		}

		var storedEvents = localStorage.getItem('eventsObject');

		if (!storedEvents) {
			var events = [];
		} else {
			var events = JSON.parse(storedEvents);
		}

		$scope.events = events;

		$scope.createEvent = function() {
			$window.location.href = "#/events/create";
		}

		$scope.deleteEvent = function() {
			var storedEvents = localStorage.getItem('eventsObject');
			
			if (!storedEvents) {
				var events = [event];
			} else {
				var events = JSON.parse(storedEvents);
				events.pop();
			}

			$scope.events = events;
			localStorage.setItem('eventsObject', JSON.stringify(events));
		}
	}
]);

eventControllers.controller('eventCreateController', ['$scope', '$window',
	function($scope, $window) {
		if (typeof(Storage) !== "undefined") {
			var eventHost = localStorage.getItem("eventApp.user")
			if (!eventHost) {
				$window.location.href = '#/login';
			} else {
				$scope.eventHost = eventHost;
			}
		}

		$scope.minDate = new Date();

		$scope.submit = function() {
			var event = {};
			event.eventHost = $scope.eventHost;
			event.eventName = $scope.eventName;
			event.eventType = $scope.eventType;
			event.eventLocation = $scope.eventLocation;
			event.eventStartDate = $scope.eventStartDate;
			event.eventEndDate = $scope.eventEndDate;
			event.eventGuests = $scope.eventGuests;
			event.eventNotes = $scope.eventNotes;

			var errorMessage = '';
			var currentDate = new Date();

			if (!event.eventHost) {
				errorMessage += '<p>- Host is missing.</p>';
			} else if (event.eventHost.length > 30) {
				errorMessage += '<p>- Host name is too long, max characters 30.</p>';
			}

			if (!event.eventName) {
				errorMessage += '<p>- Event Name is missing.</p>';
			} else if (event.eventHost.length > 30) {
				errorMessage += '<p>- Event name is too long, max characters 30.</p>';
			}

			if (!event.eventType) {
				errorMessage += '<p>- Event Type is missing.</p>';
			} else if (event.eventHost.length > 30) {
				errorMessage += '<p>- Event Type is too long, max characters 30.</p>';
			}

			if (!event.eventLocation) {
				errorMessage += '<p>- Event Location is missing.</p>';
			} else if (event.eventHost.length > 30) {
				errorMessage += '<p>- Event Location is too long, max characters 30.</p>';
			}

			if (!event.eventStartDate) {
				errorMessage += '<p>- Event Start Date is missing.</p>';
			} else if (event.eventStartDate < currentDate) {
				errorMessage += '<p>- Event must take place in the future.</p>';
			}

			if (!event.eventEndDate) {
				errorMessage += '<p>- Event End Date is missing.</p>';
			} else if (event.eventEndDate < currentDate) {
				errorMessage += '<p>- Event must end in the future.</p>';
			}

			if (event.eventEndDate && event.eventStartDate && (event.eventStartDate > event.eventEndDate)) {
				errorMessage += '<p>- Event can not take place after it ended.</p>'
			}

			if (event.eventGuests && event.eventGuests.length > 30) {
				errorMessage += '<p>- Event Guests is too long, max characters 30.</p>';
			}

			if (event.eventNotes && event.eventNotes.length > 30) {
				errorMessage += '<p>- Event Notes is too long, max characters 30.</p>';
			}

			$scope.errorMessage = errorMessage;

			if (!errorMessage) {
				var storedEvents = localStorage.getItem('eventsObject');
			
				if (!storedEvents) {
					var events = [event];
				} else {
					var events = JSON.parse(storedEvents);
					events.unshift(event);
				}

				localStorage.setItem('eventsObject', JSON.stringify(events));
				$window.location.href = '#/events';
			}
		}
	}
]);