/* global $, Sprite3D, BaseObj */
"use strict";

var GAME = GAME || {};

GAME.sprites = [];

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

		// Store globally so all sprites are grouped together:
		GAME.sprites.push(this);

		return this;
	}

	/**
	* face() - make the sprite face a certain direction
	* @param {int} angle
	*/
	face(angle) {
		this.el
			.rotationZ(angle)
			.update();
		return this;
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
