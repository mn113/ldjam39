/* global Character */
"use strict";

var GAME = GAME || {};

// THIS SCRIPT SHOULD LOAD LAST, SO DO FINAL INIT HERE

GAME.utils.loadPlayer();

GAME.npcs = {};

GAME.npcs.npcmale1 = new Character({
	id: 'npcmale1',
	room: GAME.currentRoom,
	point3d: {x:14, y:14}
});
