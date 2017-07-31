/* global $, Sprite2D */
"use strict";

var GAME = GAME || {};

/**
* Class for a 2D sprite character - a simple <div> with background:
*/
class Character extends Sprite2D {

	/**
	* constructor() - initialise a character
	* @param {str} name
	* @param {int} room
	* @param {Object} point3d
	*/
	constructor(params) {
		super(params);

		this.jqEl.addClass("character")
			.on('click', () => {
				GAME.player.talkTo(this.id);
			});

		// Undo world 3D-transform so sprite looks 2D:
		this.el
			.transformOrigin('50% 100%')
			.transformString('scale translate rz rx')
			.scale(0.7)		// TODO: use 1:1 scale sprite?
			//.z(this.z * 10)	// 20px per unit
			.move(-5,10,10)	// correcting registration?
			.rotationZ(-45)
			.rotationX(-90)
			.update();

		// Append to world:
		GAME.rooms[GAME.currentRoom].stage.appendChild(this.el);
		//this.placeAt(this.getPoint3d());
		this.reportLoc();

		return this;
	}

	/**
	* walkTo() - animate character to a new location
	* (takes into account z-changes too)
	* @param {Object} point3d {x,y,z} in PIXELS now!
	*/
	walkTo(point3d, callback) {
		if (typeof point3d.z === 'undefined') point3d.z = GAME.currentBaseHeight * GAME.tileSize;

		console.log("I start at", this.getPoint3d());
		console.log('Go to x', point3d.x, 'from', this.x * GAME.tileSize);
		console.log('Go to y', point3d.y, 'from', this.y * GAME.tileSize);
		console.log('Go to z', point3d.z, 'from', this.z * GAME.tileSize);

		var $pixel = $("#pixel");	// has already been moved to target spot

		// Using 2d screen coordinates to calculate angle to face:
		var screenDeltaX = $pixel.offset().left - this.jqEl.offset().left,
			screenDeltaY = $pixel.offset().top - this.jqEl.offset().top,
			angle = (360 / 6.28) * Math.atan2(screenDeltaY,screenDeltaX),
			dir;
		console.log(screenDeltaX, screenDeltaY);

		if (angle > 45 && angle < 135) { dir = 'front'; }
		else if (angle < 45 && angle > -45) { dir = 'right'; }
		else if (angle < -45 && angle > -135) { dir = 'back'; }
		else if (angle > 135 || angle < -135) { dir = 'left'; }
		console.log('', angle, 'º =>', dir);

		// Using transformed coords:
		var dx = point3d.x - this.x,
			dy = point3d.x - this.y,
			distance = Math.sqrt(dx*dx + dy*dy),
			duration = distance / 0.07;
		console.log('', dx.toFixed(3), 'dx', dy.toFixed(3), 'dy');
		console.log('', distance.toFixed(3), 'metres', duration.toFixed(3), 'milliseconds');

		var me = this;	// because some function nesting follows

		me.jqEl.queue("walk", function(next) {
			console.warn("Animation queued with duration", duration);

			$(me.jqEl).animate({
				left: point3d.x,
				top: point3d.y,
				translateZ: point3d.z,
			}, {
				duration: 1000,
				queue: "walk",
				easing: "linear",
				start: function() {
					me.jqEl
						.addClass(dir)
						.addClass("walking");
					//me.walkbox = utils.grid.whichWalkbox([me.x, me.y]);
				},
				complete: function() {
					me.jqEl
						.removeClass("right left back")
						.removeClass("walking");

					// Update player's z-index:
					GAME.utils.updateZIndexes(true);
					me.face(360 - GAME.worldRotateZ);

					// Update player internals:
					me.setXYZ(point3d, false);	// false = pixel units here
					me.el.update();

					//me.updateXYZ().reportLoc();
					var q = $(this).queue("walk");
					if (q.length < 1 && !$(this).is(':animated')) {
						me.jqEl.removeClass("walking fast");	// only stop anim after last queue item
						console.warn("Stopped animating.");
						callback.call();
					}
				}
			});
			// Continue:
			next();
		});
		if (!this.jqEl.is(":animated")) {
			this.jqEl.dequeue("walk");	// Starts animation
		}


		return this;
	}

	/**
	* idleAnim() - display a small character animation when doing nothing
	*/
	idleAnim() {

	}

	/**
	* runCSSAnimation() - launch a specific keyframe animation by adding a class and removing afterwards
	* @param {str} animName
	* @param {int} duration in ms
	* @param {function} callback
	*/
	runCSSAnimation(animName, duration, callback) {
		console.log("Starting animation", animName, new Date().getTime() % 1000000);
		this.jqEl.addClass(animName);

		setTimeout(function() {
			this.jqEl.removeClass(animName);
			console.log("Animation", animName, "completed.", new Date().getTime() % 1000000);
			callback.call();
		}.bind(this), duration);
	}

	/**
	* appear() - show the character
	*/
	appear() {
		this.jqEl.show();
		return this;
	}

	/**
	* disappear() - hide the character
	*/
	disappear() {
		this.jqEl.hide();
		return this;
	}

}

/**
* Extends Character class with player-specific methods:
*/
class Hero extends Character {

	/**
	* constructor() - make a new hero
	* @param {str} name
	* @param {int} room
	* @param {Object} point3d {x,y,z} in em
	*/
	constructor(params) {
		super(params);

		// Add her head sprite:
		this.head = $("<div>").addClass("head");
		this.jqEl.append(this.head);
		this.deaths = 0;
		this.inventory = ['lighter','lolly','donut3', 'donut2', 'donut1', 'paper', 'hotdog'];
		this.obesity = 0;
		this.coretemp = 0;
	}

	/**
	* interactWith() - make player interact with scenery item or npc
	* @param {str} target
	*/
	interactWith(target) {
		console.log(target);
		switch(target) {
			case 'vendingmachine':
				// Allow 2 times
				// Fully animate on third time
				this.die('crushed');
				break;
		}
	}

	/**
	* talkTo() - make player talk to an npc		// HOW TO DECIDE WHO SPEAKS FIRST?
	* @param {str} targetId
	*/
	talkTo(targetId) {
		GAME.ui.showSpeech(targetId);
	}

	/**
	* getItem() - gain an item
	* @param {str} item
	*/ // FIXME NOT USED
	getItem(item) {
		GAME.inventory.push(item);
		return this;
	}

	/**
	* useItem() - use an item from the inventory
	* @param {str} item
	* @param {bool} loseIt
	*/
	useItem(item, loseIt = true) {
		console.log(item, loseIt);

		var me = this;
		if (loseIt) me.inventory = me.inventory.filter(i => { return i !== item; });

		switch(item) {
			case 'paper':
				// Die of paper cut
				me.showHealthBar('blood', 75);
				me.showHealthBar('blood', 50);
				me.showHealthBar('blood', 25);
				me.die('bloodloss');
				break;
			case 'condom':
				// Die of asphyxiation
				me.die();
				break;
			case 'scissors':
				// Ask to walk or run
				console.log("Scissors not implemented.");
				break;
			case 'rock':
				// If in park, throw at beehive
				console.log("Rock not implemented.");
				break;
			case 'hotdog':
				// Die of choking
				me.die('choking');
				break;
			case 'lolly':
				// Decrease core temp until you die
				me.coretemp--;
				me.showHealthBar('temperature', 75 - 25 * me.coretemp);	// 50,25
				if (me.coretemp === -2) me.die('freezing');
				break;
			case 'donut1':
			case 'donut2':
			case 'donut3':
				// Increase obesity until you die
				me.obesity++;	// 0,1,2,3
				me.showHealthBar('fitness', 100 - 25 * me.obesity);	// 75,50,25
				if (me.obesity === 3) me.die('obesity');
				break;
			default:
				console.log("No item to use.");
		}
	}

	/**
	* die() - start specific death animation and gain achievement
	* @param {str} death
	*/
	die(deathKey) {
		// Freeze user input by disabling CSS pointer-events:
		$("body").addClass("inputFrozen");

		// Face forwards:
		this.jqEl.removeClass('right left back');

		var me = this; // because lots of function nesting follows

		switch(deathKey) {
			case 'electricity':
			case 'lightning':
				me.runCSSAnimation('shocked', 700, function() {
					// Generic collapse death:
					me.die();
					me.achieve(deathKey);
				});
				break;

			case 'poison':
				me.runCSSAnimation('vomiting', 1000, function() {
					me.die();
					me.achieve('poison');
				});
				break;

			case 'burning':
				me.runCSSAnimation('burnt', 2000, function() {
					me.die();
					me.disappear();
					me.achieve(deathKey);
				});
				break;

			case 'frozen':
				me.runCSSAnimation('frozen', 1000, function() {
					me.die();
					me.achieve(deathKey);
				});
				break;

			case 'decapitation':
				me.runCSSAnimation('headless', 1000, function() {
					me.die();
					me.achieve(deathKey);
				});
				break;

			case 'choking':
				me.runCSSAnimation('blueface', 1000, function() {
					me.die();
					me.achieve(deathKey);
				});
				break;

			case 'bloodloss':
				me.runCSSAnimation('whiteface', 750, function() {
					me.die();
					me.achieve(deathKey);
				});
				break;

			case 'allergy':
				me.runCSSAnimation('redface', 750, function() {
					me.die();
					me.achieve(deathKey);
				});
				break;

			case 'dysentery':
				me.runCSSAnimation('greenface', 750, function() {
					me.die();
					me.achieve(deathKey);
				});
				break;

			case 'chocolate':
				me.runCSSAnimation('brownface', 750, function() {
					me.die();
					me.achieve(deathKey);
				});
				break;

			// Cases with no animation at all, just disappearance:
			case 'crushed':
			case 'squashed':
				GAME.utils.addBloodpool(me.x, me.y);
				// falls through:
			case 'drowned':
			case 'sharkfood':
				me.disappear();
				me.achieve(deathKey);
				break;

			// Generic blood-fall cases:
			case 'dogbite':
			case 'stabbed':
			case 'shot':
				me.jqEl.addClass("bloody");
				// falls through:
			// Generic fall cases:
			case 'runover':
			case 'falling':
			case 'obesity':
			case 'dehydration':
			case 'cancer':
			case 'oldage':
			case 'timeparadox':
				me.runCSSAnimation('dying', 1000, function() {
					me.die();
					GAME.utils.addBloodpool(me.x, me.y);
					me.achieve(deathKey);
				});
				break;

			// Final stage of death process	(no argument passed):
			default:
				// Animation (if called) has just finished
				me.jqEl.addClass('dead');
				me.becomeGhost();
				break;
		}
	}

	/**
	* becomeGhost() - add a ghost sprite at player's position and float upwards
	*/
	becomeGhost() {
		var $ghost = $("<div id='ghost'>");//.addClass('sprite2d');
		$("#ui").append($ghost);

		// Give ghost screen coordinates of player:
		$ghost.css({
			left: this.jqEl.offset().left,
			top: this.jqEl.offset().top
		});

		// Ascend to heaven:
		$ghost.animate({top:0}, 3000, function() {	//TODO: make cooler-looking effect
			$ghost.remove();
			this.respawn();
		}.bind(this));

		return this;
	}

	/**
	* respawn() - move the player back to the respawn point and flash him
	* @param {int} roomId
	* @param {Object} spawnPt {x,y,z}
	*/
	respawn(roomId = 0, spawnPt, flash = true) {
		this.disappear();
		// Clear any classes:
		this.jqEl.removeClass()
				.addClass('character');

		// Transport to correct room and square:
		this.jqEl.appendTo($("#room"+roomId));
		this.placeAt(spawnPt || GAME.rooms[roomId].respawn);
		this.appear();

		// Flash?:
		if (flash) {
			this.runCSSAnimation('flashing', 3000, function() {
				$("body").removeClass("inputFrozen");
			});
		}
		else {
			$("body").removeClass("inputFrozen");
		}
	}

	/**
	* achieve() - complete a game achievement, show text on screen
	* @param {str} deathKey
	*/
	achieve(deathKey) {
		// Dirty hack to account for ghost animation:
		setTimeout(function() {
			GAME.achievements[deathKey].unlocked = true;
			GAME.ui.showSuccessMessage(GAME.achievements[deathKey]);
			GAME.player.deaths++;
			GAME.ui.updateDeathCount();
		}, 2000);
	}

	/**
	* showHealthBar() - show a small bar above player's head
	* @param {str} text
	* @param {int} percentage
	*/
	showHealthBar(text, percentage = 50) {		// limit percentages to 25,50,75
		var $bar = $("<figure>").html(text).addClass('percent'+percentage);
		this.jqEl.append($bar);

		setTimeout(function() {
			$bar.remove();
		}, 1500);
	}

}
