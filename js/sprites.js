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

		// Append to world:
		GAME.rooms[GAME.currentRoom].stage.appendChild(this.el);

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
	* @param {Object} point3d {x,y,z} in em
	* @param {int} rotationZ
	* @param {str} classNames
	* @param {str} onclick
	*/
	constructor(params) {
		super(params);

		this.jqEl.addClass('ground');

		// Attach one or the other behaviour:
		if (params.onclick === 'pickUp') {
			this.jqEl.on('click', this.pickUp.bind(this));
		}
		else if (params.onclick === 'interactWith') {
			this.jqEl.on('click', () => { GAME.player.interactWith(this.id).bind(this); });
		}

		return this;
	}

	pickUp() {
		console.log(this);
		this.jqEl.remove();
		GAME.player.inventory.push(this.id);
		GAME.ui.updateInventory();
	}
}
