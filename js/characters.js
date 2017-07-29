/* global $, Sprite3D, BaseObj */
"use strict";

var GAME = GAME || {};

GAME.characters = {
	/**
	* init() - make a player:
	* @param {type} paramName
	*/
	loadPlayer: function() {
		// She's not the hero we need, she's the hero we DESERVE!
		GAME.player = new Hero('player', 0, {x:3, y:3});	// TODO: get room spawnPt
	}
};


/**
* Generic class for all 2D sprites (player, npcs, doors, scenery, items...)
*/
class Sprite2D extends BaseObj {
	constructor(params) {
		super();
	}
}


/**
* Class for a 2D sprite character - a simple <div> with background:
*/
class Character extends BaseObj {

	/**
	* constructor() - initialise a character
	* @param {str} name
	* @param {int} room
	* @param {Object} point3d
	*/
	constructor(name, room, point3d) {
		super();
		this.name = name;

		// Wrapper for document.createElement('div')
		// Also gives element extra 3D functionality:
		this.el = Sprite3D.create();
		this.el.addClass("character").setAttribute("id", name);

		// Also attach jQuery wrapped reference:
		this.jqEl = $(this.el);

		// Establish coordinates:
		this.setXYZ(point3d);

		// Undo world 3D-transform so sprite looks 2D:
		this.el
			.transformOrigin('50% 100%')
			.transformString('scale translate rz rx')
			.scale(0.7)		// TODO: use 1:1 scale sprite
			.z(this.z * 10)	// 20px per unit
			.move(10,0,0)	// correct registration?
			.rotationZ(-45)
			.rotationX(-90)
			.update();

		// Append to world:
		GAME.stage.appendChild(this.el);
		this.placeAt(this.getPoint3d());

		return this;
	}

	/**
	* walkTo() - animate character to a new location
	* (takes into account z-changes too)
	* @param {Object} point3d {x,y,z} in PIXELS now!
	*/
	walkTo(point3d) {
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

		/*
		// Give owner the correct classes:
		this.jqEl
			.addClass(dir)
			.addClass("walking");

		// Perform animation using Transit:
		this.jqEl.transition({
			left: point3d.x,
			top: point3d.y,
			translateZ: point3d.z + 'em',
			complete: function() {
				this.jqEl
					.removeClass("right left back")
					.removeClass("walking");

				// Update player's z-index:
				updateZIndexes(true);

				// Update player internals:
				this.setXYZ(point3d);
				this.el.update();
			}.bind(this)
		}, duration);
		*/

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
					me.setXYZ(point3d);
					me.el.update();

					//me.updateXYZ().reportLoc();
					var q = $(this).queue("walk");
					if (q.length < 1 && !$(this).is(':animated')) {
						me.jqEl.removeClass("walking fast");	// only stop anim after last queue item
						console.warn("Stopped animating.");
						return;
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
	* face() - make the character face a certain direction
	* @param {int} angle
	*/
	face(angle) {
		console.log(this.el, angle);
		this.el
			.rotationZ(angle)
			.update();
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
			console.log("Calling back.", new Date().getTime() % 1000000);
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

	constructor(name, room, point3d) {
		super(name, room, point3d);

		// Add her head sprite:
		this.head = $("<div>").addClass("head");
		this.jqEl.append(this.head);
	}

	/**
	* interactWith() - make player interact with scenery item or npc
	* @param {str} target
	*/
	interactWith(target) {
		console.log(target);
		// switch(target)
	}

	/**
	* getItem() - gain an item
	* @param {str} item
	*/
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
		// switch(item)
	}

	/**
	* die() - start specific death animation and gain achievement
	* @param {str} death
	*/
	die(death) {
		// Freeze user input by disabling CSS pointer-events:
		$("body").addClass("inputFrozen");

		// Face forwards:
		this.jqEl.removeClass('right left back');

		var me = this; // because lots of function nesting follows

		switch(death) {
			case 'electricity':
			case 'lightning':
				me.runCSSAnimation('shocked', 700, function() {
					// Generic collapse death:
					me.die();
					GAME.goals.achieve(death);
				});
				break;

			case 'vomiting':
				me.runCSSAnimation('vomiting', 1000, function() {
					me.die();
					GAME.goals.achieve('poison');
				});
				break;

			case 'burning':
				me.runCSSAnimation('burnt', 2000, function() {
					me.die();
					me.disappear();
					GAME.goals.achieve('burning');
				});
				break;

			case 'frozen':
				me.runCSSAnimation('frozen', 1000, function() {
					me.die();
					GAME.goals.achieve('frozen');
				});
				break;

			case 'decapitation':
				me.runCSSAnimation('headless', 1000, function() {
					me.die();
					GAME.goals.achieve('decapitation');
				});
				break;

			case 'choking':
				me.runCSSAnimation('blueface', 1000, function() {
					me.die();
					GAME.goals.achieve('choking');
				});
				break;

			case 'bloodloss':
				me.runCSSAnimation('whiteface', 750, function() {
					me.die();
					GAME.goals.achieve('bloodloss');
				});
				break;

			case 'allergy':
				me.runCSSAnimation('redface', 750, function() {
					me.die();
					GAME.goals.achieve('allergy');
				});
				break;

			case 'dysentery':
				me.runCSSAnimation('greenface', 750, function() {
					me.die();
					GAME.goals.achieve('dysentery');
				});
				break;

			case 'chocolate':
				me.runCSSAnimation('brownface', 750, function() {
					me.die();
					GAME.goals.achieve('chocolate');
				});
				break;

			// Cases with no animation at all, just disappearance:
			case 'crushed':
			case 'squashed':
				//$("#room").append($("<div>").addClass("bloodpool"));
				GAME.utils.addBloodpool(me.x, me.y);
				// falls through:
			case 'drowned':
			case 'sharkfood':
				me.disappear();
				GAME.goals.achieve(death);
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
					//$("#room").append($("<div>").addClass("bloodpool"));
					GAME.utils.addBloodpool(me.x, me.y);
					GAME.goals.achieve(death);
				});
				break;

			// Final stage of death process	(no argument passed):
			default:
				// Animation (if called) has just finished
				me.jqEl.addClass('dead');

				var $ghost = $("<div id='ghost'>").addClass('sprite2d');
				// SHOULD THE GHOST GO ON THE UI LAYER?
				$("#room").append($ghost);
				$ghost.animate({top:0, right:0}, 3000, function() {
					$ghost.remove();
					me.respawn();
				});
				break;
		}
	}

	/**
	* respawn() - move the player back to the respawn point and flash him
	* @param {int} roomId
	* @param {Object} spawnPt {x,y,z}
	*/
	respawn(roomId = 0, spawnPt) {
		this.disappear();
		// Clear any classes:
		this.jqEl.removeClass();
		this.placeAt(GAME.rooms[roomId].respawn);
		this.appear();
		this.runCSSAnimation('flashing', 3000, function() {
			$("body").removeClass("inputFrozen");
		});
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

GAME.characters.loadPlayer();
