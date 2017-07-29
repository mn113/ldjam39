/* global $, Sprite3D */
"use strict";

var GAME = GAME || {};

// Building config:
GAME.tileSize = 20;		// 20px = 1em = 1 tile
GAME.currentBoxColour = 'hypercube';	// initial box skin
GAME.currentBaseHeight = 0;				// initial z

// Sprite3D init:
GAME.stage = Sprite3D.stage(document.getElementById("room"));
GAME.stage.perspective(1000000)
	.css("transform-style","preserve-3d")
	.origin(100,0,0)
	.transformString('rx rz translate scale')
	.rotationX(60)
	.rotationZ(45)
	.move(0,0,1)
	.scale(2.5)
	.update();


// Draw a red 2x2 square for navigational debugging:
var pixel = document.createElement('aside');
pixel.setAttribute("id","pixel");
document.querySelector("#room").appendChild(pixel);
//var ctx = pixel.getContext('2d');
//ctx.fillStyle='#ff0000';
//ctx.fillRect(0, 0, 2, 2);

/**
* Basic positioning methods for objects with jQuery & Sprite3D elements:
*/
class BaseObj {
	/**
	* constructor() - empty
	*/
	constructor(params) {
		// do nothing
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
	* setXYZ() - set objects position properties
	* @param {Object} point3d
	*/
	setXYZ(point3d) {
		if (typeof point3d.z === 'undefined') point3d.z = 1;
		this.x = point3d.x;
		this.y = point3d.y;
		this.z = point3d.z;
		return this;
	}
}


/**
* Class for a 3D box of any dimensions, position, rotation, and skins:
*/
class Box extends BaseObj {
	/**
	* constructor() - initialise a box
	* @param {str} name
	* //@param {int} room
	* @param {str} id
	* @param {str} classNames
	* @param {Array} dimensions [dx,dy,dz] in em
	* @param {Object} point3d {x,y,z} in em
	* @param {int} rotationZ
	* @param {Object} skins {faceName: className} object for CSS background images
	*/
	constructor(params) {
		super(params);
		// Process params, set defaults:
		if (typeof params.point3d.z === 'undefined') params.point3d.z = GAME.currentBaseHeight;
		if (typeof params.rotationZ === 'undefined') params.rotationZ = 0;
		// If no skins, it takes className
		// if no className, it takes currentBoxColour
		if (typeof params.skins === 'undefined') params.skins = {};
		if (typeof params.classNames === 'undefined') params.classNames = GAME.currentBoxColour;
		if (typeof params.id === 'undefined') params.id = "";
		this.name = params.name;
		this.point3d = params.point3d;
		this.rotationZ = params.rotationZ;
		this.skins = params.skins;
		this.classNames = params.classNames;
		this.id = params.id;
		this.dx = params.dimensions[0] * GAME.tileSize;	// convert dimensions to pixels for internal use
		this.dy = params.dimensions[1] * GAME.tileSize;
		this.dz = params.dimensions[2] * GAME.tileSize;

		// Unpack coordinates to x,y,z props:
		this.setXYZ(this.point3d);

		// Create 6 divs inside 1:
		this.el = Sprite3D.box(
			this.dx,
			this.dz,	// switch y and z on purpose, so textures align
			this.dy,
			'.newcube'
		).move(this.dx/2, this.dy/2, this.dz/2)
		.rotationX(90)	// top on top
		.rotationZ(this.rotationZ) // front on the intended side
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
		console.log("data-z of", this.jqEl, "is", this.jqEl.data("z"));

		// Skinning:
		//console.log("Skinning", this.skins, this.classNames, GAME.currentBoxColour);
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
		GAME.stage.appendChild(this.el);

		return this;
	}
}


class Exit extends Box {
	constructor(params) {
		super(params);
		if (params.roomId === 'undefined') params.roomId = GAME.currentRoom;
		this.direction = params.direction;
		this.destination = params.destination;
		this.roomId = params.roomId;

		// Always spawn 1 tile from the edge:
		this.spawnPoint = this.point3d;
		if (this.spawnPoint.x === -1) this.spawnPoint.x += 1;
		if (this.spawnPoint.x === 15) this.spawnPoint.x += 1;
		if (this.spawnPoint.y === -1) this.spawnPoint.y -= 1;
		if (this.spawnPoint.y === 15) this.spawnPoint.y -= 1;

		this.jqEl.addClass('exit');

		return this;
	}

	exitFrom() {
		// Load new room
		// Enter:
		// GAME.rooms[this.destination.room].exits[this.destination.exit].enterFrom()
	}

	enterFrom() {
		console.log("Entering room", this.roomId, "at", this.spawnPoint);
		GAME.player.respawn(this.roomId, this.spawnPoint);
	}
}


class Pyramid extends BaseObj {
	//TODO
}


class Roof extends BaseObj {
	//TODO
}
