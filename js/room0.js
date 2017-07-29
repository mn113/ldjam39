/* global $, Box, Exit, Sprite3D */
"use strict";

var GAME = GAME || {};
GAME.currentRoom = 0;

// Set up a Sprite3D stage:
GAME.rooms[GAME.currentRoom].stage = Sprite3D.stage(
	document.getElementById("room"+GAME.currentRoom)
);
GAME.rooms[GAME.currentRoom].stage
	.perspective(1000000)
	.css("transform-style","preserve-3d")
	.origin(100,0,0)
	.transformString('rx rz translate scale')
	.rotationX(60)
	.rotationZ(45)
	.move(0,0,1)
	.scale(2.5)
	.update();

// Define room contents:
GAME.rooms[GAME.currentRoom].contents = (function() {
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

	GAME.currentBoxColour = 'grey';
	g.exits = [
		new Exit({
			dimensions: [1, 1, GAME.currentBaseHeight],
			point3d: {x:15, y:4, z:0},
			direction: 'east',
			destination: {room:0, exit:0}
		}),
		new Exit({
			dimensions: [1, 1, GAME.currentBaseHeight],
			point3d: {x:15, y:12, z:0},
			direction: 'east',
			destination: {room:0, exit:1}
		}),
		new Exit({
			dimensions: [1, 1, GAME.currentBaseHeight],
			point3d: {x:-1, y:7, z:0},
			direction: 'west',
			destination: {room:0, exit:1}
		})
	];

	GAME.currentBoxColour = 'blue';
	g.houses = [
		new Box({
			dimensions: [1,1,1],
			point3d: {x:1, y:11}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:2, y:11}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:2, y:12}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:2, y:13}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:6, y:12}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:7, y:12}
		})
	];

	GAME.currentBoxColour = 'red';
	g.houses2 = [
		new Box({
			dimensions: [1,1,1],
			point3d: {x:3, y:1}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:5, y:1}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:6, y:1}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:7, y:1}
		}),
	];

	GAME.currentBoxColour = 'grey';
	g.cornerhouses = [
		new Box({
			dimensions: [1,1,1],
			point3d: {x:12, y:11}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:12, y:14}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:13, y:14}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:14, y:14}
		}),
	];

	GAME.currentBoxColour = 'redbrick';
	g.redbrickhouses = [
		new Box({
			dimensions: [2,2,2],
			point3d: {x:8, y:12},
			rotationZ: -90,	// BUG: this has wrong axis
			skins: {
				front: 'redbrick',
				left: 'creamhouse',
				right: 'greybrick',
				back: 'grey',
				top: 'grass'
			}
		}),
		new Box({
			dimensions: [2,2,2],
			point3d: {x:4, y:12},
			classNames: 'creamhouse',
			skins: {
				top: 'grey'
			}
		})
	];

	GAME.currentBoxColour = 'house';
	g.doublehouses = [
		new Box({
			dimensions: [2,2,2],
			point3d: {x:12, y:5},
			skins: {
				top: 'grey'
			}
		}),
		new Box({
			dimensions: [2,2,2],
			point3d: {x:1, y:8},
			skins: {
				top: 'grey'
			}
		}),
		new Box({
			dimensions: [2,2,2],
			point3d: {x:1, y:1},
			classNames: 'grey',
			skins: {
				top: 'eavesRoof'
			}
		})
	];
	$(".eavesRoof")
		.append($("<div>").addClass("roof"))
		.append($("<div>").addClass("roof2"));

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
			skins: {
				top: 'pyramid'
			}
		})
	];
	// Pyramid:	// TODO: utility function?
	$(".pyramid")
		.append($("<div>").addClass("side left"))
		.append($("<div>").addClass("side right"))
		.append($("<div>").addClass("side front"))
		.append($("<div>").addClass("side back"));

	g.tallbox = new Box({
		dimensions: [0.5, 1, 5],
		point3d: {x:6.75, y:6.5},
		classNames: 'hypercube'
	});

	// Revealing module pattern
	return g;

}());

GAME.rooms[GAME.currentRoom].loaded = true;
