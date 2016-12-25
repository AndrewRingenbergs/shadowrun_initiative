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

	function createChar(name, body, agility, reaction, strength, willpower, logic, intuition, charisma, edge, essence, magres, dataProcessing) {
		var initBaseRolls = rollDice(10);
		var initPassAdj = 0;
		var randomCoin = Math.floor(Math.random()*100+1);

		var initManual = false;

		var initSpaceOptions = [
				{name:"Meatspace", baseDice:"1d6", attribute: reaction+intuition},
				{name:"Astral", baseDice:"2d6", attribute: intuition*2},
				{name:"Matrix: AR", baseDice:"1d6", attribute: reaction+intuition},
				{name:"Matrix: Cold", baseDice:"3d6", attribute: dataProcessing+intuition},
				{name:"Matrix: Hot", baseDice:"4d6", attribute: dataProcessing+intuition},
				{name:"Rigging AR", baseDice:"1d6", attribute: reaction+intuition}];
		var initSpace = initSpaceOptions[0].name;
		var initBaseDice = initSpaceOptions[0].baseDice;
		var initAttr = initSpaceOptions[0].attribute;

		function createInitMod(descr, modifier) {
			return {
				descr: descr,
				modifier: modifier
			}
		}

		var initModsCustom = [
			new createInitMod("Example A", 1),
			new createInitMod("Example B", 2)
		];

		var initModsAuto = [
			new createInitMod("Example C", -1)
		];

		var initModCustomNew = { descr: "", modifier: 0 };

		var damageP=0;

		return {
			guid: guid(),
			name: name,

			initSpace: initSpace,
			initSpaceOptions: initSpaceOptions,
			initBaseDice: initBaseDice,
			initAttr: initAttr,
			setInit: function ( obj ) {
				this.initSpace = obj.name;
				this.initBaseDice = obj.baseDice;
				this.initAttr = obj.attribute;
				},

			initTypeToggle: function () { this.initManual = !this.initManual; },

			initModCustomNew: initModCustomNew,
			addCustomMod: function() { this.initModsCustom.push(new createInitMod(initModCustomNew.descr,initModCustomNew.modifier)); this.initModCustomNew.descr = ""; this.initModCustomNew.modifier = 0; },
			initModsCustom: initModsCustom,
			removeCustomMod: function(customMod) { this.initModsCustom.splice(this.initModsCustom.indexOf(customMod),1); },
			initModsAuto: initModsAuto,
			initBaseManual: 0,
			initType: function() { if (this.initManual) { var out = "Manual" } else { var out = "Auto" }; return out; },
			initBase: function() { if (this.initManual) {
										var out = this.initBaseManual;
									}
									else {
										var out = this.initBaseRolls.slice(0,this.initBaseDice.split("d")[0]).reduce(function(a,b) { return a + b; },0)+this.initAttr;
									};
									return out; 
								},
			initMod: function () { return initModsCustom.reduce(function(a,b) { return a + parseInt(b["modifier"]); },0)+initModsAuto.reduce(function(a,b) { return a + parseInt(b["modifier"]); },0); },
			initPassAdj: initPassAdj,
			initBaseRolls: initBaseRolls,
			initNewRound: function() { this.initBaseRolls = rollDice(10); this.initPassAdj=0; this.randomCoin = Math.floor(Math.random()*100+1); console.log("New initiative round"); },
			initCur: function() { return this.initBase()+this.initMod()+this.initPassAdj; },
			initBreakdown: function() { 
										if (this.initManual) {
											var out = 0;
										} 
										else {
											var out = "(" + this.initBaseRolls.slice(0,this.initBaseDice.split("d")[0]) + ")+" + this.initAttr;
										};
										return out; 
									},

			healthPMax: 6,
			damageP: damageP,
			activity: "active",
			body: body,
			agility: agility,
			reaction: reaction,
			strength: strength,
			willpower: willpower,
			logic: logic,
			intuition: intuition,
			charisma: charisma,
			edge: edge,
			essence: essence,
			magres: magres,
			dataProcessing: dataProcessing,
			randomCoin: randomCoin
			
		};
	}


	function rollDice(dice) {
		var rolls = [];
		for(var i = 1; i <= dice; i++) {
			rolls.push(Math.floor(Math.random()*6+1));
		}
		return rolls;
	}

	$scope.addChar = function() {
		console.log($scope.charArr);
		console.log('Creating New Char');
		newChar = createChar("NA", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
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
		var activeCharArr = $scope.charArr.filter(function (char) { return (char.activity === 'active' && char.initCur() > 0); });

		if (activeCharArr.length > 0) {
			var targetChar = activeCharArr.reduce(function(a, b){ return a.initCur() > b.initCur() ? a : b });
			// Set targetChar.active to true
			targetChar.activity = 'selected';
		}
		else {
			// Start new pass
			$scope.charArr.forEach( function (obj) { obj.initPassAdj = obj.initPassAdj-10; });
			$scope.charArr.forEach( function (obj) { obj.activity = 'active'; });

			// New round if all characters have negative/0 initiative
			if ($scope.charArr.filter(function (objArr) { return objArr.initCur() > 0; }).length == 0) {
				$scope.charArr.forEach( function (obj) {
					obj.initNewRound();
				});
			}
			$scope.nextInit();
		}

		console.log($scope.charArr)
	}

	$scope.deleteChip = function(char) {
		console.log("Deleting chip", char);
		console.log($scope.charArr);
		$scope.charArr.splice($scope.charArr.indexOf(char),1);
	}

	$scope.setInitSpace = function(char, elem) {
		//char.initSpace = elem.name
		char.setInit(elem)
		console.log("Setting initiative space", char);
	}

	$scope.charArr = [];
	$scope.charArr.push(createChar("Alpha", 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 0, 0));
	$scope.charArr.push(createChar("Beta", 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0));

	console.log("Page load finished");

	/*
	$scope.createInitArr = function() {  
		var out = [];
		for(var i = 0; i < $scope.charArr.length; i++) {
			for (var init = $scope.charArr[i].initCur(); init > 0; init = init - 10) {
				out.push( { name: $scope.charArr[i].name, init: init } );
			}
		}; 
		return out;
	};

	$scope.$watch( // consider changing this to be less computationally expensive (i.e. less deep))
		"charArr",
		function(newVal, oldVal) { $scope.initArr = $scope.createInitArr(); console.log("test",$scope.initArr); },
		true
	);*/

});
