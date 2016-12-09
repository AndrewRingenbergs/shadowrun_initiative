function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function char(name,initBase,initCur) {
	this.guid = guid();
	this.name = name;
	this.initBase = initBase;
	this.initCur = initCur;
	this.activity = "active";
}

var charArr = new Array();
charArr.push(new char("Alpha",18,3));
charArr.push(new char("Beta",5,4));

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
	newElement.className = "closebtn";
	newElement.setAttribute('onClick','Javacsript:deleteChip(this)');
	var newContent = document.createTextNode("\u00D7"); 
	newElement.appendChild(newContent);
	newCharacterChip.appendChild(newElement);

	var charactersDiv = document.getElementById("characterList");
  	charactersDiv.appendChild(newCharacterChip); 
}


function addChar() {

	newChar = new char("NA",0,0)
	charArr.push(newChar)
  	insertChip(newChar)
}

function sort_data() {
	
	charArr.sort(function (a, b) { return parseInt(b.initCur) - parseInt(a.initCur); });

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