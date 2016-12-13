var app = angular.module("myApp", []); 

app.controller("myCtrl", function($scope) {  

	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
		};

	function guid() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		};

	function createChar(name, initBase, initCur) {
		return {
			guid: guid(),
			name: name,
			initBase: initBase,
			initCur: initCur,
			healthPMax: 6,
			damageP: 0,
			activity: "active"
		};
	}

	$scope.addChar = function() {
		console.log('Creating New Char');
		newChar = createChar("NA", 0, 0);
		$scope.charArr.push(newChar);
	}

	$scope.healthBoxClick = function(char, h) {
		// Set damageP
		char.damageP = h;
	}

	$scope.nextInit = function() {
		console.log('Next Initiative being calculated');

		// Set current active char to acted
		var activeCharArrPrior = $scope.charArr.filter(function (char) { return char.activity === "selected"; })[0];
		if (activeCharArrPrior) {
			activeCharArrPrior.activity = 'acted';
		}

		// Get list of non-acted characters & find the one with highest current initiative
		var activeCharArr = $scope.charArr.filter(function (char) { return (char.activity === 'active' && char.initCur > 0); });

		if (activeCharArr.length > 0) {
			var targetChar = activeCharArr.reduce(function(a, b){ return a.initCur > b.initCur ? a : b });
			// Set targetChar.active to true
			targetChar.activity = 'selected';
		}
		else {
			// Start new pass
			$scope.charArr.forEach( function (obj) { obj.initCur = obj.initCur - 10; });
			$scope.charArr.forEach( function (obj) { obj.activity = 'active' });
			
			// New round if all characters have negative/0 initiative
			if ($scope.charArr.filter(function (objArr) { return objArr.initCur > 0; }).length == 0) {
				$scope.charArr.forEach( function (obj) { obj.initCur = obj.initBase; });
			}
			$scope.nextInit();
		}

		console.log($scope.charArr)
	}

	$scope.deleteChip = function(char) {
		console.log("Deleting chip", char);
		$scope.charArr.splice($scope.charArr.indexOf(char));
	}

	$scope.charArr = [];
	$scope.charArr.push(createChar("Alpha", 18, 3));
	$scope.charArr.push(createChar("Beta", 5, 4));

	console.log("Page load finished");

});