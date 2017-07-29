/* global $, Box, Exit, Sprite3D */
"use strict";

var GAME = GAME || {};
GAME.currentRoom = 1;

GAME.room0 = (function() {
	var g = {};

	/**************************/
	/* ROOM 0 BOX DEFINITIONS */
	/**************************/
	// Establish a baseplate with a certain height:
	GAME.currentBaseHeight = 0.2;
	g.base = new Box({
		dimensions: [15, 15, GAME.currentBaseHeight],
		point3d: {x:0, y:0, z:0},
		id: "baseplate0",
		skins: {
			top: 'floor_room0',
			left: 'grey',
			right: 'grey',
			front: 'grey',
			back: 'grey'
		}
	});
	// Exits:
	g.exits = [
		new Exit({
			dimensions: [1, 1, GAME.currentBaseHeight],
			point3d: {x:15, y:4, z:0},
			classNames: 'exit',
			direction: 'east',
			destination: {room:0, exit:0}
		}),
		new Exit({
			dimensions: [1, 1, GAME.currentBaseHeight],
			point3d: {x:15, y:12, z:0},
			classNames: 'exit',
			direction: 'east',
			destination: {room:0, exit:1}
		}),
		new Exit({
			dimensions: [1, 1, GAME.currentBaseHeight],
			point3d: {x:-1, y:7, z:0},
			classNames: 'exit',
			direction: 'west',
			destination: {room:0, exit:1}
		})
	];
	// Example cube
	g.newcube2x = new Box({
		dimensions: [2,2,2],
		point3d: {x:8, y:12},
		rotationZ: -90,
		skins: {
			front: 'redbrick',
			left: 'red',
			right: 'greybrick',
			back: 'grey',
			top: 'grass'
		}
	});
	g.doublenewcube2x = new Box({
		dimensions: [2,2,2],
		point3d: {x:4, y:12},
		classNames: 'hypercube'
	});
	g.tallbox = new Box({
		dimensions: [0.5, 1, 5],
		point3d: {x:6.75, y:6.5},
		classNames: 'hypercube'
	});

	GAME.currentBoxColour = "grey";
	g.fountainborders = [
		new Box({
			dimensions: [0.2, 2, 0.2],
			point3d: {x:5.8, y:6},
		}),
		new Box({
			dimensions: [0.2, 2, 0.2],
			point3d: {x:8, y:6},
		}),
		new Box({
			dimensions: [2, 0.2, 0.2],
			point3d: {x:6, y:5.8},
		}),
		new Box({
			dimensions: [2, 0.2, 0.2],
			point3d: {x:6, y:8},
		})
	];
	g.flats = [
		new Box({
			dimensions: [1, 1, 0.2],
			point3d: {x:5, y:4},
		}),
		new Box({
			dimensions: [1, 1, 0.2],
			point3d: {x:8, y:4},
		}),
		new Box({
			dimensions: [1, 1, 0.2],
			point3d: {x:5, y:9},
		}),
		new Box({
			dimensions: [1, 1, 0.2],
			point3d: {x:8, y:9},
		}),
		new Box({
			dimensions: [2, 2, 2],
			point3d: {x:8, y:0},
		})
	];

	GAME.currentBoxColour = "grass";
	g.grasses = [
		new Box({
			dimensions: [1, 1, 0.2],
			point3d: {x:14, y:3},
		}),
		new Box({
			dimensions: [1, 1, 0.2],
			point3d: {x:13, y:3},
		}),
		new Box({
			dimensions: [1, 1, 0.2],
			point3d: {x:12, y:3},
		}),
		new Box({
			dimensions: [1, 1, 0.2],
			point3d: {x:12, y:2},
		}),
		new Box({
			dimensions: [1, 1, 0.2],
			point3d: {x:12, y:1},
		}),
		new Box({
			dimensions: [1, 1, 0.4],
			point3d: {x:12, y:0},
		})
	];

	GAME.currentBoxColour = 'greybrick';
	g.church = [
		new Box({
			dimensions: [3, 3, 2],
			point3d: {x:12, y:8},
			skins: {
				top: 'grey',
				right: 'grey'
			}
		}),
		new Box({
			dimensions: [2, 2, 2],
			point3d: {x:12, y:8.5, z:2},
			skins: {
				top: 'grey'
			}
		}),
		new Box({
			dimensions: [1, 1, 1],
			point3d: {x:12, y:9, z:4},
		})
	];

	// Pyramid:
	g.roof = Sprite3D.create('pyramid1')
		.move(240,180,116)	// pyramid must sit -0.2em in Z
		.update();
	GAME.stage.appendChild(g.roof);
	$("#pyramid1")
		.addClass('pyramid')
		.append($("<div>").addClass("side left"))
		.append($("<div>").addClass("side right"))
		.append($("<div>").addClass("side front"))
		.append($("<div>").addClass("side back"));

	// Revealing module pattern
	return g;

}());
