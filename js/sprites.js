/* global $, Sprite3D, BaseObj */
"use strict";

var GAME = GAME || {};


/**
* Generic class for all 2D sprites (player, npcs, doors, scenery, items...)
*/
class Sprite2D extends BaseObj {
	/**
	* Generic class for all 2D sprites (player, npcs, doors, scenery, items...)
	* @param {str} id
	* @param {str} name
	* @param {Object} point3d {x,y,z} in em
	* @param {int} rotationZ
	* @param {str} classNames
	*/
	constructor(params) {
		super(params);
		this.classNames = params.classNames;

		// Wrapper for document.createElement('div')
		// Also gives element extra 3D functionality:
		this.el = Sprite3D.create()
			.move(10,10,10)
			.rotate(-90,this.rotationZ,0)
			.update()
			.bind('click', function(e) {
				console.log(e.target.classList[0]);	// for debugging
			}, false);

		// Position in world:
		this.placeAt(this.getPoint3d());

		// Wrap it in jQ too:
		this.jqEl = $(this.el)
			.attr("id", this.id)
			.addClass(this.classNames);

		return this;
	}
}


class Door extends Sprite2D {
	/**
	* Generic class for all 2D sprites (player, npcs, doors, scenery, items...)
	* @param {str} id
	* @param {str} name
	* @param {Object} point3d {x,y,z} in em
	* @param {int} rotationZ
	* @param {str} classNames
	* @param {int} pairId
	* @param {Object} spawnPt {x,y,z} in em
	*/
	constructor(params) {
		super(params);

		this.pairId = params.pairId;	// e.g. 0
		this.spawnPt = params.spawnPt;
		this.jqEl.addClass("door");

		// Append to world:
		GAME.rooms[GAME.currentRoom].stage.appendChild(this.el);

		// Make functional:
		this.jqEl.on('click', function() {
			// Proximity test:
			if (GAME.utils.gridProximity(this, GAME.player) < 50) {
				this.passThrough();
			}
			else {
				// Walk there, then enter:
				GAME.player.walkTo(GAME.utils.convertEmToPixels(this.spawnPt), () => {	// wants pixel input
					this.passThrough();
				});
			}
		}.bind(this));

		return this;
	}

	// Takes you immediately in one door and out another one
	// FIXME: may need to adjust world rotation?
	passThrough() {
		// find the corresponding door and respawn outside it
		var pair = GAME.rooms[GAME.currentRoom].contents.doors[this.pairId];
		var destDoor = pair.filter(door => {
			// Choose not this door, but the other one:
			return door.id !== this.id;
		})[0];
		GAME.player.respawn(GAME.currentRoom, destDoor.spawnPt, false);
	}

	// Takes you inside somewhere
	enter() {

	}

}


class GroundItem extends Sprite2D {
	/**
	* Generic class for all 2D sprites (player, npcs, doors, scenery, items...)
	* @param {str} id
	* @param {str} name
	* @param {Object} point3d {x,y,z} in em
	* @param {int} rotationZ
	* @param {str} classNames
	*/
	constructor(params) {
		super(params);

		return this;
	}


}
