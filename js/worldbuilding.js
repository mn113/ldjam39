/* global $, Sprite3D */
"use strict";

var GAME = GAME || {};

// Building config:
GAME.tileSize = 20;		// 20px = 1em = 1 tile
GAME.currentBoxColour = 'hypercube';	// initial box skin
GAME.currentBaseHeight = 0;				// initial z
GAME.currentRoom = 0;	// FIXME defined later


/**
* Basic positioning methods for objects with jQuery & Sprite3D elements:
*/
class BaseObj {
	/**
	* constructor() - just set params
	* @param {str} id
	* @param {Object} point3d {x,y,z} in em
	* @param {int} rotationZ
	*/
	constructor(params) {
		if (typeof params.id === 'undefined') params.id = "";
		if (typeof params.point3d.z === 'undefined') params.point3d.z = GAME.currentBaseHeight;
		if (typeof params.rotationZ === 'undefined') params.rotationZ = 0;
		this.id = params.id;
		//this.name = params.name;
		this.point3d = params.point3d;
		this.x = params.point3d.x;
		this.y = params.point3d.y;
		this.z = params.point3d.z;
		this.rotationZ = params.rotationZ;

		return this;
	}

	/**
	* setXYZ() - set object's internal positional properties in pixels
	* @param {Object} point3d
	* @param {Boolean} emUnits
	*/
	setXYZ(point3d, emUnits = true) {
		// Set using pixels internally:
		this.x = (emUnits) ? point3d.x * GAME.tileSize : point3d.x;
		this.y = (emUnits) ? point3d.y * GAME.tileSize : point3d.y;
		this.z = (emUnits) ? point3d.z * GAME.tileSize : point3d.z;
		return this;
	}

	/**
	* placeAt() - set position within world via CSS
	* @param {Object} point3d
	*/
	placeAt(point3d) {
		// Set x and y using top/left (so it doesn't get mixed up with transformX & transformY):
		this.el.style.left = point3d.x + 'em';
		this.el.style.top = point3d.y + 'em';

		// Set z-position using Sprite3D:
		this.el.move(0, 0, point3d.z * GAME.tileSize).update();

		console.log("Placed", this, "at", this.el.style.left, this.el.style.top);

		return this;
	}

	/**
	* getPoint3d() - get world coordinates in object form
	*/
	getPoint3d() {
		return {
			x: this.x,
			y: this.y,
			z: this.z
		};
	}

	/**
	* reportLoc() - report my location
	*/
	reportLoc() {
		console.info(this.id + ": I'm at (" + this.x + ', ' + this.y + '), Z-' + this.z);
	}

}


/**
* A 3D box of any dimensions, position, rotation, and skins:
*/
class Box extends BaseObj {
	/**
	* constructor() - initialise a box
	* @param {Array} dimensions [dx,dy,dz] in em
	* @param {Array} classNames
	* @param {Object} skins {faceName: className} object for CSS background images
	*/
	constructor(params) {
		super(params);
		// Process params, set defaults:
		// If no skins, it takes className
		// if no className, it takes currentBoxColour
		if (typeof params.skins === 'undefined') params.skins = {};
		if (typeof params.classNames === 'undefined') params.classNames = GAME.currentBoxColour;
		this.classNames = params.classNames;
		this.skins = params.skins;

		this.dx = params.dimensions[0] * GAME.tileSize;	// convert dimensions to pixels for internal use
		this.dy = params.dimensions[1] * GAME.tileSize;
		this.dz = params.dimensions[2] * GAME.tileSize;

		// Create 6 divs inside 1:
		this.el = Sprite3D.box(
			this.dx,
			this.dz,	// switch y and z on purpose, so textures align
			this.dy,
			'.newcube'
		).move(this.dx/2, this.dy/2, this.dz/2)
		.rotationX(90)	// top on top
		.rotationY(this.rotationZ) // front on the intended side
		.update()
		.bind('click', function(e) {
			console.log(e.target.classList[0]);	// for debugging
		}, false);

		// Position in world:
		this.placeAt(this.getPoint3d());

		// Also attach jQuery wrapped reference:
		this.jqEl = $(this.el)
			.attr("id", this.id)
			.data("z", (this.z * GAME.tileSize) + this.dz);
		//console.log("data-z of", this.jqEl, "is", this.jqEl.data("z"));

		// Skinning:
		for (var side of ['top','bottom','left','right','front','back']) {
			var skinClassName = this.skins[side];
			if (typeof skinClassName !== 'undefined') {
				this.jqEl.children('.'+side).addClass(skinClassName);
			}
			else {
				this.jqEl.children('.'+side).addClass(this.classNames);
			}
		}

		// Append to world:
		GAME.rooms[GAME.currentRoom].stage.appendChild(this.el);

		return this;
	}
}


/**
* A flat 3D box representing an exit, data-linked to corresponding room/exit:
*/
class Exit extends Box {
	constructor(params) {
		super(params);
		if (params.roomId === 'undefined') params.roomId = GAME.currentRoom;
		this.direction = params.direction;
		this.destination = params.destination;
		this.roomId = GAME.currentRoom;

		var rot = {
			'north': 90,
			'south': -90,
			'east': 0,
			'west': 180
		};
		//this.el.rotationY(rot).update();	// BUG WTF!! rotate!

		// Always spawn 1 tile from the edge:
		this.spawnPoint = this.point3d;
		if (this.spawnPoint.x === -1) this.spawnPoint.x += 1;
		if (this.spawnPoint.x === 15) this.spawnPoint.x += 1;
		if (this.spawnPoint.y === -1) this.spawnPoint.y -= 1;
		if (this.spawnPoint.y === 15) this.spawnPoint.y -= 1;

		this.jqEl.addClass('exit '+this.direction)
		.data("dest-room", this.destination.room)
		.data("dest-exit", this.destination.exit);

		return this;
	}

	exitFrom() {
		console.warn("Exiting room", this.roomId, "by exit", this.destination.exit);
		// Load new room:
		GAME.utils.switchRoom(this.roomId, this.destination.room);
		// Enter:
		setTimeout(() => {
			GAME.rooms[this.destination.room].contents.exits[this.destination.exit].enterFrom();
		}, 1000);
	}

	enterFrom() {
		console.warn("Entering room", this.roomId, "at", this.spawnPoint);
		GAME.player.respawn(this.roomId, this.spawnPoint);
	}
}



/**
* An invisible 1x1x1 box with a door sprite on its front side:
*/
class Door extends Box {
	/**
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

		// Apply rotationZ to Y axis:
		//this.el.rotate(0,this.rotationZ,0).update();

		// Style one side:
		this.jqEl.addClass('door');
		this.jqFront = this.jqEl.children('.front');

		// Make functional:
		this.jqEl.on('click', function() {
			// Proximity test:
			if (GAME.utils.gridProximity(this, GAME.player) < 50) {
				// Animate:
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

	openClose() {
		this.jqFront.addClass('open');
		setTimeout(() => { this.jqFront.removeClass('open'); }, 1000);
	}

	// Takes you immediately in one door and out another one
	// FIXME: may need to adjust world rotation?
	passThrough() {
		// Animate first door:
		this.openClose();
		GAME.player.disappear();
		// find the corresponding door and respawn outside it
		var pair = GAME.rooms[GAME.currentRoom].contents.doors[this.pairId];
		var destDoor = pair.filter(door => {
			// Choose not this door, but the other one:
			return door.id !== this.id;
		})[0];
		if (destDoor) {
			// Delay, then show passing through:
			setTimeout(() => {
				destDoor.openClose();
				GAME.player.respawn(GAME.currentRoom, destDoor.spawnPt, false);
			}, 500);
		}
	}

	// Takes you inside somewhere
	enter() {

	}

}


class Pyramid extends BaseObj {
	//TODO?
}

class Roof extends BaseObj {
	//TODO?
}
