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
	this.active = false;
	this.acted = false;
}

var charArr = new Array();
charArr.push(new char("Alpha",18,3));
charArr.push(new char("Beta",5,4));

function addRow() {

	newChar = new char("NA",0,0)
	charArr.push(newChar)
    var table = document.getElementById("tableInitiative");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
	
	row.id = newChar.guid

	var td = document.createElement('TD');
	   td.innerHTML = '<input type="button" value = "Delete" onClick="Javacsript:deleteRow(this)">';
           row.appendChild(td);

	var td = document.createElement('TD');
	   td.headers='name'
           td.width='75';
	   td.contentEditable='true'
           td.appendChild(document.createTextNode(newChar.name));
	   td.setAttribute('onBlur','tblChange(this,event);');
           row.appendChild(td);

	var td = document.createElement('TD');
	   td.headers='initBase'
           td.width='75';
	   td.contentEditable='true'
	   td.appendChild(document.createTextNode(newChar.initBase));
	   td.setAttribute('onBlur','tblChange(this,event);');
           row.appendChild(td);

	var td = document.createElement('TD');
	   td.headers='initCur'
           td.width='75';
	   td.appendChild(document.createTextNode(newChar.initCur));
	   td.contentEditable='true'
	   td.setAttribute('onBlur','tblChange(this,event);');
           row.appendChild(td);

}

function checkGuid(age) {
    return age >= 18;
}

function deleteRow(obj) {
      
    var index = obj.parentNode.parentNode.rowIndex;
	//console.log('Deleting ' + obj.parentNode.parentNode.id + " name: " + charArr.filter(function ( objArr ) { return objArr.guid === obj.parentNode.parentNode.id; })[0].name)

for(var i = charArr.length - 1; i >= 0; i--) {
    if(charArr[i].guid === obj.parentNode.parentNode.id) {
	console.log('Deleting ' + charArr[i].guid + " name: " + charArr[i].name)
       charArr.splice(i, 1);
    }
}

    var table = document.getElementById("tableInitiative");
    table.deleteRow(index);
    
}
 
function addTable() {
    
	sort_data();
    var myTableDiv = document.getElementById("myDynamicTable");

    var table = document.getElementById("tableInitiative");
	if(table) table.parentNode.removeChild(table)

    var table = document.createElement('TABLE');
    table.border='1';
table.id = "tableInitiative"

	var header = table.createTHead();

	var row = header.insertRow(0);
	var cell = row.insertCell(0);
	cell.innerHTML = "";
	var cell = row.insertCell(1);
	cell.innerHTML = "<b>Name</b>";
	cell.id="name";
	var cell = row.insertCell(2);
	cell.innerHTML = "<b>Base</b>";
	cell.id="initBase";
	var cell = row.insertCell(3);
	cell.innerHTML = "<b>Cur</b>";
	cell.id="initCur";

    
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
      
    for (var i=0; i<charArr.length; i++){
       var tr = document.createElement('TR');
	tr.id = charArr[i].guid;
	tr.className = 'defaultChar';
       tableBody.appendChild(tr);
       
	   var td = document.createElement('TD');
	   td.innerHTML = '<input type="button" value = "Delete" onClick="Javacsript:deleteRow(this)">';
           tr.appendChild(td);

           var td = document.createElement('TD');
	   td.headers='name'
           td.width='75';
	   td.contentEditable='true'
           td.appendChild(document.createTextNode(charArr[i].name));
	   td.setAttribute('onBlur','tblChange(this,event);');
           tr.appendChild(td);

	   var td = document.createElement('TD');
	   td.headers='initBase'
           td.width='75';
	   td.contentEditable='true'
           td.appendChild(document.createTextNode(charArr[i].initBase));
	   td.setAttribute('onBlur','tblChange(this,event);');
           tr.appendChild(td);

	   var td = document.createElement('TD');
	   td.headers='initCur'
           td.width='75';
	   td.contentEditable='true'
           td.appendChild(document.createTextNode(charArr[i].initCur));
	   td.setAttribute('onBlur','tblChange(this,event);');
           tr.appendChild(td);

    }
    myTableDiv.appendChild(table);

	formatTable();
    
}

function formatTable() {
	for (var i=0; i<charArr.length; i++){
		var tr = document.getElementById(charArr[i].guid);

		// Highlight active char
		if (charArr[i].active == true)
			tr.className = 'activeChar';
		else {
			// Highlight acted char
			if (charArr[i].acted == true)
				tr.className = "actedChar";
			else
				tr.className = "defaultChar";
		}
	}
}

function tblChange(element,event) {

	console.log(element.parentNode.id + " " + element.headers + " " + charArr.filter(function ( objArr ) { return objArr.guid === element.parentNode.id; })[0][element.headers] + " changed to " + element.textContent)
	
	var char = charArr.filter(function ( objArr ) { return objArr.guid === element.parentNode.id; })[0]

	// should do some sort of validation
	console.log(typeof char[element.headers])
	if (typeof char[element.headers] === 'number') {
		var n = parseInt(element.textContent, 10)
	}
	else n = element.textContent

	if (element.textContent === n.toString()){
		//console.log("True " + n + char.name);
		if (n === char[element.headers]) {
			// do nothing
		}
		else { // update object
			char[element.headers] = n
			console.log(char.name + "[" + element.headers + "] = " + char[element.headers])
		}
	}
	else {
		console.log("False " + parseInt(element.textContent, 10));
		// replace with old value
		element.textContent = char[element.headers]
	}
	

    //GET THE CONTENT as TEXT ONLY, you may use innerHTML as required
   //alert("content " + element.textContent)
}
 
function load() {

	createCharTable();

    console.log("Page load finished");
 
}

function createCharTable() {

	// Delete old
	var el = document.getElementById('characterInitTracker');
	while ( el.firstChild ) el.removeChild( el.firstChild );

	// Create new
	sort_data();
	charArr.forEach( function (obj) { insertChip(obj); });
}

function insertChip(objChar) {

	var newCharacterChip = document.createElement("div");
	newCharacterChip.className = "characterChip";
	newCharacterChip.id = objChar.guid;

	var newChipName = document.createElement("div");
	newChipName.className = "chipName";
	newChipName.contentEditable='true';
	newChipName.setAttribute('onBlur','chipValidate(this,event);');
	var newContent = document.createTextNode(objChar.name); 
	newChipName.appendChild(newContent);
	newCharacterChip.appendChild(newChipName);

	var newChipName = document.createElement("div");
	newChipName.className = "chipInitBase";
	newChipName.contentEditable='true';
	newChipName.setAttribute('onBlur','chipValidate(this,event);');
	var newContent = document.createTextNode(objChar.initBase); 
	newChipName.appendChild(newContent);
	newCharacterChip.appendChild(newChipName);

	var newChipName = document.createElement("div");
	newChipName.className = "chipInitCur";
	newChipName.contentEditable='true';
	newChipName.setAttribute('onBlur','chipValidate(this,event);');
	var newContent = document.createTextNode(objChar.initCur); 
	newChipName.appendChild(newContent);
	newCharacterChip.appendChild(newChipName);

	var charactersDiv = document.getElementById("characterInitTracker");
  	charactersDiv.appendChild(newCharacterChip); 
}


function addChar() {

	newChar = new char("NA",0,0)
	charArr.push(newChar)
  	insertChip(newChar)
}

function sort_data() {
	
	charArr.sort(function (a, b) { return parseInt(b.initCur) - parseInt(a.initCur); });
	//addTable();
}

function chipValidate(element,event) {
	var char = charArr.filter(function ( objArr ) { return objArr.guid === element.parentNode.id; })[0]
	
	if (element.className === 'chipName') {
		var charProperty = 'name'
	}
	if (element.className === 'chipInitCur') {
		var charProperty = 'initCur'
	}
	if (element.className === 'chipInitBase') {
		var charProperty = 'initBase'
	}

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
	var activeCharArrPrior = charArr.filter(function (objArr) { return objArr.active === true; })[0];
	if (typeof activeCharArrPrior != 'undefined') {
		activeCharArrPrior.active = false;
		activeCharArrPrior.acted = true;
	}

	// Get list of non-acted characters & find the one with highest current initiative
	var activeCharArr = charArr.filter(function (objArr) { return (objArr.acted === false && objArr.initCur > 0); });

	if (activeCharArr.length > 0) {
		var targetChar = activeCharArr.reduce(function(a, b){ return a.initCur > b.initCur ? a : b });

		// Set targetChar.active to true
		targetChar.active = true;
	}
	else {
		// Start new pass
		charArr.forEach( function (obj) { obj.initCur = obj.initCur - 10; });
		charArr.forEach( function (obj) { obj.acted = false });
		
		// New round if all characters have negative/0 initiative
		if (charArr.filter(function (objArr) { return objArr.initCur > 0; }).length == 0) {
			charArr.forEach( function (obj) { obj.initCur = obj.initBase; });
		}
		next_init();
	}

	// refresh table
	addTable();
}