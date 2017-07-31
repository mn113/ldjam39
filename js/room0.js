/* global $, Box, Exit, Sprite3D, Door, GroundItem */
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
	g.exits = {
		0: new Exit({
			dimensions: [1, 1, GAME.currentBaseHeight],
			point3d: {x:15, y:4, z:0},
			direction: 'east',
			destination: {room:1, exit:0}	// exits are connected through matching ids
		}),
		1: new Exit({
			dimensions: [1, 1, GAME.currentBaseHeight],
			point3d: {x:15, y:12, z:0},
			direction: 'east',
			destination: {room:1, exit:1}
		}),
		2: new Exit({
			dimensions: [1, 1, GAME.currentBaseHeight],
			point3d: {x:-1, y:7, z:0},
			direction: 'west',
			destination: {room:1, exit:2}
		})
	};

	GAME.currentBoxColour = 'blue';
	g._houses = [
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
	g._houses2 = [
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
	g._cornerhouses = [
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
	g._redbrickhouses = [
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
	g._doublehouses = [
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
				top: 'grass'
			}
		}),
		new Box({
			dimensions: [2,2,2],
			point3d: {x:1, y:1},
			classNames: 'grey',
			skins: {
				top: 'eavesRoof'
			}
		}),
		new Box({
			dimensions: [2, 2, 2],
			point3d: {x:8, y:0},
			classNames: 'redbrick',
			skins: {
				top: 'eavesRoof'
			}
		})
	];

	GAME.currentBoxColour = "grey";
	g._fountainborders = [
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
	g._flats = [
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
		})
	];

	GAME.currentBoxColour = "grass";
	g._grasses = [
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
	g._church = [
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

	g.doors = {	// define them in pairs
		0: [
			new Door({
				id: 'door001',
				pairId: 0,	// matches outer key
				dimensions: [1,1,1],
				point3d: {x:8, y:1},
				spawnPt: {x:8, y:2},
				rotationZ: 180,
				skins: {
					front: 'doorGreen'
				}
			}),
			new Door({
				id: 'door002',
				pairId: 0,
				dimensions: [1,1,1],
				point3d: {x:9, y:1},
				spawnPt: {x:10, y:1},
				rotationZ: 90,
				skins: {
					front: 'doorGreen'
				}
			})
		]
	};

	g.vending = new Box({
		dimensions: [0.6, 0.6, 1],
		point3d: {x:1, y:12},
		rotationZ: 180,
		classNames: 'vendingmachine'
	});
	g.vending.jqEl.on('click', '.front', () => {
		// Proximity test:
		if (GAME.utils.gridProximity(g.vending, GAME.player) < 50) {
			GAME.player.interactWith('vendingmachine');
		}
		else {
			// Walk there, then act:
			GAME.player.walkTo(GAME.utils.convertEmToPixels({x:1,y:12.75}), () => {	// wants pixel input
				GAME.player.interactWith('vendingmachine');
			});
		}
	});

	g.grounditems = [
		new GroundItem({
			id: 'rock',
			point3d: {x:9, y:9},
			onclick: 'pickUp'
		})
	];

	// Revealing module pattern
	return g;

}());

GAME.utils.buildRooftops(GAME.currentRoom);

GAME.rooms[GAME.currentRoom].loaded = true;
