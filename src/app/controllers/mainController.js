export default function($scope, uuid) {
  "ngInject"

	$scope.items = [
		{ type: "Armour", name: "Armour vest", rating: 9, avail: 4, cost: 500 },
		{ type: "Armour", name: "Armour jacket", rating: 12, avail: 2, cost: 1000 },

		{ type: "Ranged Weapons", name: "Browning Ultra-Power", subtype: "Heavy Pistols", acc: "5 (6)", damage: "8P", AP: -1, mode: "SA", RC: 0, ammo: 10, ammoContainer: 'c', avail: "4R", cost: 640 },

		{ type: "Melee Weapons", name: "Knife", subtype: "Blades", acc: 5, reach: "-", damage: "(STR+1)P", AP: -1, avail: "-", cost: 10 },

		{ type: "Melee Weapons", name: "Spurs (retractable)", subtype: "Cyber", acc: "NA", reach: "-", damage: "(STR+3)P", AP: -2, ess: 0.3, CAP: "[3]", avail: "12F", cost: 5000 },
		
		{ type: "Ammo", name: "Regular ammo", subtype: "Ammo", damageMod: 0, APMod: 0, avail: "2R", cost: 20 },
		{ type: "Ammo", name: "Hollow points", subtype: "Ammo", damageMod: 1, APMod: 2, avail: "4F", cost: 70 },

		{ type: "Gear", name: "Meta Link commlink", subtype: "Commlinks", rating: 1, avail: 2, cost: 100 },
		{ type: "Gear", name: "Sony Emperor commlink", subtype: "Commlinks", rating: 2, avail: 4, cost: 700 },
		{ type: "Gear", name: "Renraku Sensei commlink", subtype: "Commlinks", rating: 3, avail: 6, cost: 1000 },
		{ type: "Gear", name: "Erika Elite commlink", subtype: "Commlinks", rating: 4, avail: 8, cost: 2500 },
		{ type: "Gear", name: "Hermes Ikon commlink", subtype: "Commlinks", rating: 5, avail: 10, cost: 3000 },
		{ type: "Gear", name: "Transys Avalon commlink", subtype: "Commlinks", rating: 6, avail: 12, cost: 5000 },
		{ type: "Gear", name: "Fairlight Caliban commlink", subtype: "Commlinks", rating: 7, avail: 14, cost: 8000 },
		
		{ type: "Gear", name: "Jazz", subtype: "Drugs", addictionRating: 8, additionThreshold: 3, avail: "2R", cost: 75 },
		{ type: "Gear", name: "Cram", subtype: "Drugs", addictionRating: 4, additionThreshold: 3, avail: "2R", cost: 10 }
	];

	var findItemByName = function(itemName) {
	 	return $scope.items.filter(function( obj ) { return obj.name == itemName; })[0];
	}

	function createChar(name, body, agility, reaction, strength, willpower, logic, intuition, charisma, edge, essence, magres, dataProcessing, activeSkills, gearList, equippedArmour, equippedRangedWeapon, equippedMeleeWeapon) {
		
		var damageP = 0;
		var damageS = 0;
		var damageDPModifier = 0;
		
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
			new createInitMod("Condition Modifier", damageDPModifier)
		];

		var initModCustomNew = { descr: "", modifier: 0 };

		var equippedAmmo = { name: "Regular", qtyMax: 25, qtyUsed: 6 };

		return {
			uuid: uuid.v4(),
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
			initBaseManual: 0,
			initModsAuto: initModsAuto,
			updateInitModsAuto: function() { this.initModsAuto = [ new createInitMod("Condition Modifier", this.damageDPModifier) ]; },
			initType: function() { if (this.initManual) { var out = "Manual" } else { var out = "Auto" }; return out; },
			initBase: function() { if (this.initManual) {
										var out = this.initBaseManual;
									}
									else {
										var out = this.initBaseRolls.slice(0,this.initBaseDice.split("d")[0]).reduce(function(a,b) { return a + b; },0)+this.initAttr;
									};
									return out; 
								},
			initMod: function () { return this.initModsCustom.reduce(function(a,b) { return a + parseInt(b["modifier"]); },0)+this.initModsAuto.reduce(function(a,b) { return a + parseInt(b["modifier"]); },0); },
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
			
			healthPMax: 8+Math.ceil(body/2), // need to get this to update automatically
			healthSMax: 8+Math.ceil(willpower/2), // need to get this to update automatically
			damageP: damageP,
			damageS: damageS,
			damageDPModifier: damageDPModifier,

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
			randomCoin: randomCoin,
			
			equippedArmour: equippedArmour,
			equippedRangedWeapon: equippedRangedWeapon,
			equippedAmmo: equippedAmmo,
			equippedMeleeWeapon: equippedMeleeWeapon,

			gearList: gearList,

			activeSkills: activeSkills

		};
	}

	$scope.getNumber = function(num) {
		return new Array(num);   
	}

	function rollDice(dice) {
		var rolls = [];
		for(var i = 1; i <= dice; i++) {
			rolls.push(Math.floor(Math.random()*6+1));
		}
		return rolls;
	}


	// [ TEMPORARY ]
		var gearList = [
			{name: "Browning Ultra-Power", rating: 0, quantity: 1, pageRef: 52 },
			{name: "Armour vest", rating: 1, quantity: 2, pageRef: 0 },
			{name: "Test Equipment C", rating: 1, quantity: 0, pageRef: 5 }
		];

	$scope.charTypes = [ 
		{type:"Blank",template:createChar("NA", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [], [])}, 
		{type:"Ganger",template:createChar("Ganger", 4, 4, 3, 4, 3, 2, 3, 3, 0, 6, 0, 0, 
			[
				{ name: "Blades", rating: 4 },
				{ name: "Clubs", rating: 3 },
				{ name: "Etiquette", specialisation: "Street", rating: 3 },
				{ name: "Intimidation", rating: 4 },
				{ name: "Pistols", rating: 4 },
				{ name: "Unarmed Combat", rating: 3 },
			], 
			gearList = [
				{name: "Browning Ultra-Power", rating: 0, quantity: 1, pageRef: 0 },
				{name: "Knife", rating: 0, quantity: 1, pageRef: 0 },
				{name: "Armour vest", rating: 1, quantity: 2, pageRef: 0 },
				{name: "Meta Link commlink", rating: 1, quantity: 1, pageRef: 0 },
				{name: "Cram or Jazz", rating: 0, quantity: 1, pageRef: 411 }
			]
		)},
		{type:"Ganger Lieutennant",template:createChar("Ganger Lieutennant", 4, 4, 4, 4, 4, 3, 4, 4, 0, 5.7, 0, 0,
			[
				{ name: "Blades", rating: 3 },
				{ name: "Etiquette", specialisation: "Street", rating: 4 },
				{ name: "Intimidation", rating: 4 },
				{ name: "Leadership", rating: 1 },
				{ name: "Pistols", specialisation: "Semi-Automatics", rating: 3 },
				{ name: "Thrown Weapons", rating: 2 },
				{ name: "Unarmed Combat", specialisation: "Cyberimplants", rating: 3 }				
			], 
			gearList = [
				{name: "Browning Ultra-Power", rating: 0, quantity: 1, pageRef: 0 },
				{name: "Knife", rating: 0, quantity: 1, pageRef: 0 },
				{name: "Spurs (retractable)", rating: 0, quantity: 1, pageRef: 0 },
				{name: "Armour jacket", rating: 1, quantity: 2, pageRef: 0 },
				{name: "Sony Emperor commlink", rating: 2, quantity: 1, pageRef: 0 },
				{name: "Cram or Jazz", rating: 0, quantity: 1, pageRef: 411 }
		])}
	];
	console.log($scope.charTypes);
	$scope.charTypeInsertable = $scope.charTypes[0];
	$scope.setCharTypeInsertable = function(charType) {
		$scope.charTypeInsertable = charType;
	}
	$scope.numCharsAdd = 1;

	$scope.addChar = function() {
		console.log('Creating New Char');
		var template = $scope.charTypeInsertable.template;
		for(var i = 0; i < $scope.numCharsAdd; i++) {
			var newChar = createChar(template.name, template.body, template.agility, template.reaction, template.strength, template.willpower, template.logic, template.intuition, template.charisma, template.edge, template.essence, template.magres, template.dataProcessing, template.activeSkills, template.gearList, template.equippedArmour, template.equippedRangedWeapon, template.equippedRangedWeapon);
			$scope.charArr.push(newChar);
		}
		console.log($scope.charArr);
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
	$scope.charArr.push(createChar("Alpha", 4, 1, 3, 2, 3, 4, 4, 5, 6, 7, 8, 5, 
		[
			{ name: "Armourer", rating: 3 },
			{ name: "Computer", rating: 4 },
			{ name: "Archery", rating: 5 }
		],
		[
			{name: "Browning Ultra-Power", rating: 0, quantity: 1, pageRef: 52 },
			{name: "Armour Vest", rating: 1, quantity: 2, pageRef: 0 },
			{name: "Test Equipment C", rating: 1, quantity: 0, pageRef: 5 }
		]));
	$scope.charArr.push(createChar("Beta", 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0,
		[
			{ name: "Armourer", rating: 3 },
			{ name: "Computer", rating: 4 },
			{ name: "Archery", rating: 5 }
		],
		[
			{name: "Browning Ultra-Power", rating: 0, quantity: 1, pageRef: 52 },
			{name: "Armour Vest", rating: 1, quantity: 2, pageRef: 0 },
			{name: "Test Equipment C", rating: 1, quantity: 0, pageRef: 5 }
		]));

	$scope.selectedCharIndex = 0;

	$scope.getSelectedChar = function(char) {
		$scope.selectedCharIndex = $scope.charArr.indexOf(char);
	};

	$scope.updateCharacter = function(char) {
		char.healthPMax = 8+Math.ceil(char.body/2);
		char.healthSMax = 8+Math.ceil(char.willpower/2);
	}

	$scope.addCustomMod = function(char) {
		char.initModsCustom.push( { descr: char.initModCustomNew.descr, modifier: char.initModCustomNew.modifier } ); 
		char.initModCustomNew.descr = ""; char.initModCustomNew.modifier = 0; 
	};

	$scope.removeCustomMod = function(char,customMod) {
		char.initModsCustom.splice(char.initModsCustom.indexOf(customMod),1);
	}


	 $scope.healthBoxClick = function(char,type,h) {
		if (type === 'P') {
			if (char.damageP >= h) {
				char.damageP = h-1;
			} 
			else {
				char.damageP = h;
			}
		}
		else if (type === 'S') {
			if (char.damageS >= h) {
				char.damageS = h-1;
			} 
			else {
				char.damageS = h;
			}
		}
		char.damageDPModifier = -Math.max(Math.floor(char.damageP/3), Math.floor(char.damageS/3));
		char.updateInitModsAuto();
	}

	// Gear stuff
	$scope.gearClick = function(char, itemName) {
		var item = findItemByName(itemName);

		if (item != null) {
			switch (item.type) {
				case "Armour":
					char.equippedArmour = item;
					break;
				case "Ranged Weapons":
					char.equippedRangedWeapon = item;
					break;
				case "Melee Weapons":
					char.equippedMeleeWeapon = item;
					break;
			}
		}
	}

	$scope.removeGearItem = function(char,gearItem) {
		if (gearItem.quantity <= 0) {
			var item = findItemByName(gearItem.name);
			
			if (item != null) {
				switch (item.type) {
						case "Armour":
							char.equippedArmour = null;
							break;
						case "Ranged Weapons":
							char.equippedRangedWeapon = null;
							break;
						case "Melee Weapons":
							char.equippedMeleeWeapon = null;
							break;
					}
			}

			char.gearList.splice(char.gearList.indexOf(gearItem),1);
		}
	}

	/*$scope.itemListFilter = "";
	$scope.itemListNavClick = function(itemType) {
		console.log(itemType, $scope.itemListFilter);
	} */

	$scope.addItemToActiveCharGear = function(item) {
		var char = $scope.charArr[$scope.selectedCharIndex];
		var newItem = { name: item.name, type: item.type, rating: 0, quantity: 1, pageRef: 0, qtyMax: null, qtyUsed: null, details: null };

		var itemFound = char.gearList.filter(function( obj ) { return ((obj.name === newItem.name)&(obj.qtyMax === newItem.qtyMax)&(obj.qtyUsed === newItem.qtyUsed)&(obj.details === newItem.details)); })[0]
		if (itemFound != null) {
			itemFound.quantity += 1;
		}
		else {
			char.gearList.push(newItem);
		}
	}

	$scope.itemTypes = [
		{ type: "Armour" },
		{ type: "Ranged Weapons" },
		{ type: "Melee Weapons" },
		{ type: "Ammo" },
		{ type: "Gear" }
	];

	$scope.itemTypeSelected = null;

	$scope.itemTypeClick = function(obj) {
		if ($scope.itemTypeSelected === obj) {
			$scope.itemTypeSelected = null;
		}
		else {
			$scope.itemTypeSelected = obj;
		}
	};

	$scope.itemNameAdj = function(item) {
		let nameAdj = item.name;

		if ((item.qtyUsed != null)&(item.qtyMax != null)&(item.details != null))
			nameAdj += ' (' + parseInt(item.qtyMax-item.qtyUsed) + '/' + item.qtyMax + ', ' + item.details + ')';
		
		return nameAdj;
	}

	// Active Skills
	$scope.listActiveSkills = [
		{ name: "Animal Handling", attr: "charisma" },
		{ name: "Archery", attr: "agility" },
		{ name: "Armourer", attr: "logic" },
		{ name: "Automatics", attr: "agility" },
		{ name: "Blades", attr: "agility" },
		{ name: "Clubs", attr: "agility" },
		{ name: "Computer", attr: "logic" },
		{ name: "Con", attr: "charisma" },
		{ name: "Cybercombat", attr: "logic" },
		{ name: "Cybertechnology", attr: "logic" },
		{ name: "Demolitions", attr: "logic" },
		{ name: "Disguise", attr: "intuition" },
		{ name: "Electronic Warfare", attr: "logic" },
		{ name: "Escape Artist", attr: "agility" },
		{ name: "Etiquette", attr: "charisma" },
		{ name: "First Aid", attr: "logic" },
		{ name: "Forgery", attr: "logic" },
		{ name: "Gunnery", attr: "agility" },
		{ name: "Gymnastics", attr: "agility" },
		{ name: "Hacking", attr: "logic" },
		{ name: "Hardware", attr: "logic" },
		{ name: "Heavy Weapons", attr: "agility" },
		{ name: "Impersonation", attr: "charisma" },
		{ name: "Instruction", attr: "charisma" },
		{ name: "Intimidation", attr: "charisma" },
		{ name: "Leadership", attr: "charisma" },
		{ name: "Locksmith", attr: "agility" },
		{ name: "Longarms", attr: "agility" },
		{ name: "Navigation", attr: "intuition" },
		{ name: "Negotiation", attr: "charisma" },
		{ name: "Palming", attr: "agility" },
		{ name: "Perception", attr: "intuition" },
		{ name: "Performance", attr: "charisma" },
		{ name: "Pilot Ground Craft", attr: "reaction" },
		{ name: "Pilot Watercraft", attr: "reaction" },
		{ name: "Pistols", attr: "agility" },
		{ name: "Sneaking", attr: "agility" },
		{ name: "Survival", attr: "willpower" },
		{ name: "Throwing Weapons", attr: "agility" },
		{ name: "Tracking", attr: "intuition" },
		{ name: "Unarmed Combat", attr: "agility" }
	];

	$scope.getCharActiveSkill = function(char, activeSkill) {
		let list = char.activeSkills.filter(function( obj ) { return obj.name === activeSkill.name; });
		let out = null;

		if (list.length != 0)
			out = list[0];
		
		return out;
	}

	$scope.getAdjSkillName = function(char, activeSkill){
		let adjName = activeSkill.name;
		const charSkill = $scope.getCharActiveSkill(char, activeSkill);
		
		if (charSkill != null)
			if (charSkill.specialisation != null)
				adjName = adjName + ' ('+ charSkill.specialisation + ')';
		
		return adjName;
	}
	
	$scope.getActiveSkillRating = function(char, activeSkill) {
		let rating = 0;
		const charSkill = $scope.getCharActiveSkill(char, activeSkill);;
		if (charSkill != null)
				rating = charSkill.rating;
		
		return rating;
	}

	$scope.getActiveSkillAttrVal = function(char, attr){
		return char[attr];
	}

	$scope.getActiveSkillPool = function(char, activeSkill){
		return $scope.getActiveSkillRating(char, activeSkill) + $scope.getActiveSkillAttrVal(char, activeSkill.attr);
	}

	$scope.getActiveSkillPoolPrint = function(char, activeSkill){
		let pool = $scope.getActiveSkillPool(char, activeSkill);
		const charSkill = $scope.getCharActiveSkill(char, activeSkill);
		
		if (charSkill != null)
			if (charSkill.specialisation != null)
				pool = pool + ' ('+ parseInt(pool+2) + ')';
		
		return pool;
	}

	// Ammo
	$scope.ammoBoxClick = function(char, index) {
		if (index <= char.equippedAmmo.qtyUsed)
			char.equippedAmmo.qtyUsed = index-1;
		else
			char.equippedAmmo.qtyUsed = index;
	}

	$scope.equipAmmo = function(char,ammoItem) {
		if ((ammoItem.type === "Ammo")&(char.equippedRangedWeapon != null)) {
			if ((ammoItem.details == null)|(ammoItem.details === char.equippedRangedWeapon.subtype)) {
				if (ammoItem.qtyMax == null) {
					let ammoItemOld = { name: ammoItem.name, type: ammoItem.type, rating: ammoItem.rating, quantity: ammoItem.quantity-1, pageRef: ammoItem.pageRef, qtyMax: ammoItem.qtyMax, qtyUsed: ammoItem.qtyUsed, details: ammoItem.details };
					if (ammoItemOld.quantity > 0)
						char.gearList.push(ammoItemOld);
					
					ammoItem.quantity = 1;
					ammoItem.details = char.equippedRangedWeapon.subtype; 
					ammoItem.qtyMax = char.equippedRangedWeapon.ammo;
					ammoItem.qtyUsed = 0;
				}
				$scope.unequipAmmo(char, char.equippedAmmo);
				char.equippedAmmo = ammoItem;
			}
		}
	}

	$scope.unequipAmmo = function(char, ammoItem) {
		char.equippedAmmo = null;
		if ((ammoItem.qtyMax === ammoItem.qtyUsed)) {
			char.gearList.splice(char.gearList.indexOf(ammoItem),1);
		}
	}

	console.log("Page load finished");

};

