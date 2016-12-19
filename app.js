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

	function createChar(name, initBase, initMod, body, agility, reaction, strength, willpower, logic, intuition, charisma, edge, essence, magres) {
		var initBaseRolls = rollDice(10);
		var initPassAdj = 0;
		var randomCoin = Math.floor(Math.random()*100+1);

		return {
			guid: guid(),
			name: name,
			initMod: initMod,
			initBase: initBase,
			initPassAdj: initPassAdj,
			initBaseRolls: initBaseRolls,
			initRoll: function() { return this.initBase + "+" + this.initMod },
			initNewRound: function() { this.initBaseRolls = rollDice(10); this.initPassAdj=0; this.randomCoin = Math.floor(Math.random()*100+1); console.log("New initiative round"); },
			initCur: function() { return this.initBaseRolls.slice(0,this.initBase.split("d")[0]).reduce(function(a,b) { return a + b; },0)+this.initiative+this.initMod+this.initPassAdj; },
			initBreakdown: function() { return "(" + this.initBaseRolls.slice(0,this.initBase.split("d")[0]) + ")+" + (this.initMod+this.initiative); },
			healthPMax: 6,
			damageP: 0,
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
			initiative: reaction+intuition,
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
		newChar = createChar("NA", '1d6', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
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

	$scope.charArr = [];
	$scope.charArr.push(createChar("Alpha", '1d6', 3, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 0, 0));
	$scope.charArr.push(createChar("Beta", '2d6', 4, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0));

	console.log("Page load finished");

});


/*
function load() {

	createCharTable();
    console.log("Page load finished");
 
}

function createCharTable() {

	// Delete old
	var el = document.getElementById('characterList');
	while ( el.firstChild ) el.removeChild( el.firstChild );

	// Create new
	sort_data();
	charArr.forEach( function (obj) { insertChip(obj); });

}

function insertChip(objChar) {

	var newCharacterChip = document.createElement("li");
	newCharacterChip.className = "characterChip";
	newCharacterChip.id = objChar.guid;
	newCharacterChip.setAttribute('data-activity',objChar.activity);

	var newChipName = document.createElement("span");
	newChipName.className = "chipData";
	newChipName.contentEditable='true';
	newChipName.setAttribute('onBlur','chipValidate(this,event);');
	newChipName.setAttribute('data-char-property','name');
	var newContent = document.createTextNode(objChar.name); 
	newChipName.appendChild(newContent);
	newCharacterChip.appendChild(newChipName);

	var newChipName = document.createElement("span");
	newChipName.className = "chipData";
	newChipName.contentEditable='true';
	newChipName.setAttribute('onBlur','chipValidate(this,event);');
	newChipName.setAttribute('data-char-property','initBase');
	var newContent = document.createTextNode(objChar.initBase); 
	newChipName.appendChild(newContent);
	newCharacterChip.appendChild(newChipName);

	var newChipName = document.createElement("span");
	newChipName.className = "chipData";
	newChipName.contentEditable='true';
	newChipName.setAttribute('onBlur','chipValidate(this,event);');
	newChipName.setAttribute('data-char-property','initCur');
	var newContent = document.createTextNode(objChar.initCur); 
	newChipName.appendChild(newContent);
	newCharacterChip.appendChild(newChipName);

	var newElement = document.createElement("span");
	newElement.className = "healthTooltip";
	var newContent = document.createTextNode("health"); 
	newElement.appendChild(newContent);
	var newElementTip = document.createElement("span");
	newElementTip.className = "tooltiptext";
	for(var i = 1; i <= 6; i++) {
		newElementTip.appendChild(addHealthbox(i,objChar));
	}
	newElement.appendChild(newElementTip);
	newCharacterChip.appendChild(newElement);

	var newElement = document.createElement("span");
	newElement.className = "closebtn";
	newElement.setAttribute('onClick','Javacsript:deleteChip(this)');
	var newContent = document.createTextNode("\u00D7"); 
	newElement.appendChild(newContent);
	newCharacterChip.appendChild(newElement);


	var charactersDiv = document.getElementById("characterList");
  	charactersDiv.appendChild(newCharacterChip); 
}

function addHealthbox(i,objChar) {
	var element = document.createElement("span");
	element.className = "healthbox"
	element.setAttribute('onClick','healthBoxClick(this);');
	if (objChar.damageP < i)
		element.setAttribute('data-marked','false');
	else
		element.setAttribute('data-marked','true');
	element.setAttribute('data-box-num',i);
	return(element)
}


function addChar() {
	newChar = new char("NA",0,0)
	charArr.push(newChar)
  	insertChip(newChar)
}

function sort_data() {
	
	charArr.sort(function (a, b) { return parseInt(b.initCur) - parseInt(a.initCur); });

}

function healthBoxClick(element) {

	// Set damageP
	var char = charArr.filter(function ( objArr ) { return objArr.guid === element.parentNode.parentNode.parentNode.id; })[0]
	if (element.dataset.marked === 'false') // If it isn't already marked, set damage to match
		char.damageP=parseInt(element.dataset.boxNum);
	else // Otherwise unset damage
		char.damageP=parseInt(element.dataset.boxNum)-1;

	// Set boxes to reflect damageP
	var healthboxes = element.parentNode.getElementsByClassName(element.className)
	for(var i = 0; i < healthboxes.length; i++) {
		if (parseInt(healthboxes[i].dataset.boxNum) <= char.damageP)
			healthboxes[i].dataset.marked = 'true';
		else
			healthboxes[i].dataset.marked = 'false';
	}
}

function chipValidate(element,event) {
	var char = charArr.filter(function ( objArr ) { return objArr.guid === element.parentNode.id; })[0]
	
	var charProperty = element.dataset.charProperty

	if (typeof char[charProperty] === 'number') { // if number store as integer
		var n = parseInt(element.textContent, 10)
	}
	else n = element.textContent

	if (element.textContent === n.toString()){
		//console.log("True " + n + char.name);
		if (n === char[charProperty]) {
			// do nothing
		}
		else { // update object
			char[charProperty] = n
		}
	}
	else {
		// replace with old value
		element.textContent = char[charProperty]
	}
}


function next_init() {

	// Set current active char to acted
	var activeCharArrPrior = charArr.filter(function (objArr) { return objArr.activity === "selected"; })[0];
	if (typeof activeCharArrPrior != 'undefined') {
		activeCharArrPrior.activity = 'acted';
	}

	// Get list of non-acted characters & find the one with highest current initiative
	var activeCharArr = charArr.filter(function (objArr) { return (objArr.activity === 'active' && objArr.initCur > 0); });

	if (activeCharArr.length > 0) {
		var targetChar = activeCharArr.reduce(function(a, b){ return a.initCur > b.initCur ? a : b });

		// Set targetChar.active to true
		targetChar.activity = 'selected';
	}
	else {
		// Start new pass
		charArr.forEach( function (obj) { obj.initCur = obj.initCur - 10; });
		charArr.forEach( function (obj) { obj.activity = 'active' });
		
		// New round if all characters have negative/0 initiative
		if (charArr.filter(function (objArr) { return objArr.initCur > 0; }).length == 0) {
			charArr.forEach( function (obj) { obj.initCur = obj.initBase; });
		}
		next_init();
	}

	console.log(charArr)
	// refresh table
	 createCharTable();
	 displayActiveCharSheet();
}

function deleteChip(el) {
	for(var i = charArr.length - 1; i >= 0; i--) {
		if(charArr[i].guid === el.parentNode.id) {
		//console.log('Deleting ' + charArr[i].guid + " name: " + charArr[i].name)
		charArr.splice(i, 1);
		}
	}
	el.parentNode.parentNode.removeChild( el.parentNode )
}

function displayActiveCharSheet() {
	var char = charArr.filter(function (objArr) { return objArr.activity === "selected"; })[0];
	var charSheet = document.getElementById('characterSheet');
	charSheet.dataset.guid = char.guid;
	dataInputOutputUpdate(char);
}


function dataInputBlur(element) {
	var char = charArr.filter(function ( objArr ) { return objArr.guid === document.getElementById('characterSheet').dataset.guid;})[0]
	
	// should insert validation for this
	char[element.dataset.contents] = element.value;
}

function dataInputOutputUpdate(charObj) { // needs testing
	var charSheet = document.getElementById('characterSheet');
	charSheet.dataset.guid = charObj.guid;

	var dataInputs = charSheet.getElementsByClassName('sheetDataInput');
	for (var i = 0; i < dataInputs.length; i++) {
		dataInputs[i].value = charObj[dataInputs[i].dataset.contents];
	}
	var dataInputs = charSheet.getElementsByClassName('sheetDataOutput');
	for (var i = 0; i < dataInputs.length; i++) {
		dataInputs[i].textContent = charObj[dataInputs[i].dataset.contents];
	}
}
*/