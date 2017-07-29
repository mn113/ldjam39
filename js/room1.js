/* global $, Box, Exit */
"use strict";

var GAME = GAME || {};
GAME.currentRoom = 1;

GAME.rooms[GAME.currentRoom].contents = (function() {
	var g = {};

	/**************************/
	/* ROOM 1 BOX DEFINITIONS */
	/**************************/
	// Establish a baseplate with a certain height:
	GAME.currentBaseHeight = 0.2;
	GAME.currentBoxColour = 'grass';
	g.base = new Box({
		dimensions: [15, 15, GAME.currentBaseHeight],
		point3d: {x:0, y:0, z:0},
		id: "baseplate1",
		skins: {
			top: 'floor_room1'
		}
	});
	// Exits:
	g.exits = [
		new Exit({
			dimensions: [1, 1, GAME.currentBaseHeight],
			point3d: {x:-1, y:4, z:0},
			classNames: 'exit',
			direction: 'west',
			destination: {room:0, exit:0}
		}),
		new Exit({
			dimensions: [1, 1, GAME.currentBaseHeight],
			point3d: {x:-1, y:10, z:0},
			classNames: 'exit',
			direction: 'west',
			destination: {room:0, exit:1}
		})
	];
	// Buildings:
	g.churchback = new Box({
		dimensions: [1, 3, 2],
		point3d: {x:0, y:8},
		classNames: 'greybrick',
		skins: {
			top: 'grey',
			left: 'grey'
		}
	});
	// Landscape:
	g.grasslayer1 = new Box({
		dimensions: [11, 15, 0.2],
		point3d: {x:4, y:0},
		skins: {
			top: 'floor_room1'
		}
	});
	GAME.currentBaseHeight += 0.2;
	g.grasslayer2 = new Box({
		dimensions: [9, 10, 0.2],
		point3d: {x:6, y:0},
		skins: {
			top: 'floor_room1'
		}
	});
	GAME.currentBaseHeight += 0.2;
	g.grasslayer3 = new Box({
		dimensions: [8, 9, 0.2],
		point3d: {x:7, y:0},
		skins: {
			top: 'floor_room1'
		}
	});
	GAME.currentBaseHeight += 0.2;
	g.grasslayer4 = new Box({
		dimensions: [7, 8, 0.2],
		point3d: {x:8, y:0},
		skins: {
			top: 'floor_room1'
		}
	});
	GAME.currentBaseHeight += 0.2;
	g.grasslayer5 = new Box({
		dimensions: [5, 7, 0.2],
		point3d: {x:9, y:0},
		skins: {
			top: 'floor_room1'
		}
	});
	GAME.currentBaseHeight += 0.2;
	g.grasslayer6 = new Box({
		dimensions: [3, 5, 0.2],
		point3d: {x:10, y:1},
		skins: {
			top: 'floor_room1'
		}
	});
	GAME.currentBaseHeight += 0.2;
	g.grasslayer7 = new Box({
		dimensions: [1, 2, 0.2],
		point3d: {x:11, y:2}
	});

	// Revealing module pattern
	return g;

}());
