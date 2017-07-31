/* global $, Sprite3D, Box, Exit */
"use strict";

var GAME = GAME || {};
GAME.currentRoom = 2;

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
	/* ROOM 2 BOX DEFINITIONS */
	/**************************/
	// Establish a baseplate with a certain height:
	GAME.currentBaseHeight = 0.2;
	GAME.currentBoxColour = 'sand';
	g.base = new Box({
		dimensions: [15, 15, GAME.currentBaseHeight],
		point3d: {x:0, y:0, z:0},
		id: "baseplate2",
	});
	// Exits:
	g.exits = {
		2: new Exit({
			dimensions: [1, 1, 1],
			point3d: {x:15, y:7, z:0},
			direction: 'west',
			destination: {room:0, exit:2}	// exits are connected through matching ids
		})
	};
	// Landscape:
	g.grasslayer1 = new Box({
		dimensions: [13, 15, 0.2],
		point3d: {x:2, y:0},
	});
	GAME.currentBaseHeight += 0.2;
	g.grasslayer2 = new Box({
		dimensions: [12, 15, 0.2],
		point3d: {x:3, y:0},
	});
	GAME.currentBaseHeight += 0.2;
	g.grasslayer3 = new Box({
		dimensions: [11, 15, 0.2],
		point3d: {x:4, y:0},
	});
	GAME.currentBaseHeight += 0.2;
	g.grasslayer4 = new Box({
		dimensions: [10, 15, 0.2],
		point3d: {x:5, y:0},
	});
	GAME.currentBaseHeight += 0.2;
	g.grasslayer5 = new Box({
		dimensions: [8, 15, 0.2],
		point3d: {x:7, y:0},
	});

	// Walkway:
	GAME.currentBoxColour = 'grass';
	g.grasslayer6 = new Box({
		dimensions: [4, 7, 0.2],
		point3d: {x:11, y:8},
	});
	GAME.currentBoxColour = 'red';
	g._flats = [
		new Box({
			dimensions: [4, 1, 0.2],
			point3d: {x:11, y:7},
		}),
		new Box({
			dimensions: [1, 5, 0.2],
			point3d: {x:11, y:8},
		}),
	];

	// Huts:
	GAME.currentBoxColour = 'blue';
	g._houses = [
		new Box({
			dimensions: [1,1,1],
			point3d: {x:12, y:10}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:12, y:11}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:12, y:12}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:12, y:13}
		}),
		new Box({
			dimensions: [1,1,1],
			point3d: {x:12, y:13}
		})
	];

	// Sandbanks:
	GAME.currentBaseHeight += 0.2;
	g.grasslayer6 = new Box({
		dimensions: [4, 7, 0.2],
		point3d: {x:11, y:0},
	});
	GAME.currentBaseHeight += 0.2;
	g.grasslayer7 = new Box({
		dimensions: [2, 5, 0.2],
		point3d: {x:12, y:0}
	});

	// Sea:
	g.sea = [];
	for (var x = 0; x < 15; x++) {
		for (var y = 0; y < 6; y++) {
			g.sea.push(new Box({
				dimensions: [1, 1, 1],
				point3d: {x:x, y:y, z:0.2},
				classNames: 'sea sea'+Math.ceil(5 * Math.random())
			}));
		}
	}

	// Revealing module pattern
	return g;

}());

GAME.rooms[GAME.currentRoom].loaded = true;
