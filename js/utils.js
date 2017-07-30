/* global $, Hero */
"use strict";

var GAME = GAME || {};

GAME.utils = {
	loadPlayer: function() {
		// She's not the hero we need, she's the hero we DESERVE!
		GAME.player = new Hero({
			name: 'player',
			room: GAME.currentRoom,
			point3d: GAME.rooms[0].respawn
		});
		GAME.ui.updateBar();
	},

	switchRoom: function(oldRoomId, newRoomId) {	// default spawnPt already passed
		console.log("Switching to room", newRoomId);

		// Load the room if it is not in memory:
		if (!GAME.rooms[newRoomId].loaded) {
			console.log("Room not present");
			GAME.utils.loadRoom(newRoomId, function() {
				// Try again:
				GAME.utils.switchRoom(oldRoomId, newRoomId);	// FIXME: will give infinite loop if file not found
			});
		}
		else {
			// Switching animation (uses CSS transition):
			//var slideDir = '???';
			// Visual sliding left fading effect:
			// TODO: slide left, right or other directions? depending on game.worldRotateZ
			$("#room"+oldRoomId).removeClass("current");	//BUG: not working
			$("#room"+newRoomId).addClass("current");
			GAME.currentRoom = newRoomId;
			GAME.utils.bindEventsToCurrentRoom();
		}
	},

	// Load a room's content from roomX.js file
	loadRoom: function(roomId, _callback) {
		console.log("Initial loading of room", roomId);
		console.warn("Fetching script: room"+roomId+".js");
		var script= document.createElement('script');
		script.type= 'text/javascript';
		script.src= 'js/room'+roomId+'.js';
		script.async = true;
		document.body.appendChild(script);

		// Allow enough time for the js to be parsed:
		setTimeout(() => _callback.call(), 500);
	},

	// Rotate the stage around a central Z-axis
	rotateWorld: function() {
		// Rotate all rooms in world: (only 1 is rendered)
		for (var room of GAME.rooms) {
			if (room.loaded) room.stage.rotationZ(GAME.worldRotateZ).update();
		}
		// Keep player facing the camera and correctly layered:
		// TODO: replicate for all sprite2d's
		GAME.player.face(360 - GAME.worldRotateZ);
		GAME.utils.updateZIndexes();

		// Scroll bg:
		var bgOffsetX = 1.5 * window.innerWidth * (GAME.worldRotateZ % 360) / 360;
		$("body").css({
			'background-position-x': bgOffsetX+"px"
		});
	},

	// Function to pan the room to keep the player roughly central on the screen
	centreMan: function() {	// TODO: use while loops to make it smoother
		var $currentRoom = $(".room");
		var $player = GAME.player.jqEl;

		if ($player.offset().left - window.innerWidth / 2 > 150) {
			$currentRoom.css({"margin-left": "-=150px"});
		}
		else if ($player.offset().left - window.innerWidth / 2 < -150) {
			$currentRoom.css({"margin-left": "+=150px"});
		}
		if ($player.offset().top - window.innerHeight / 2 > 150) {
			$currentRoom.css({"margin-top": "-=150px"});
		}
		else if ($player.offset().top - window.innerHeight / 2 < -150) {
			$currentRoom.css({"margin-top": "+=150px"});
		}
	},

	// Set the z-index of every element in the room, to be its screen y-coordinate.
	// By doing the same to the player sprite, we should get the correct layering effect
	updateZIndexes: function(onlyUpdatePlayer = false) {
		if (onlyUpdatePlayer) {
			GAME.player.el.style.zIndex = parseInt(GAME.player.jqEl.offset().top);
		}
		else {
			$(".room > *").each(function() {
				// y-coord becomes z-index:
				this.style.zIndex = parseInt($(this).offset().top);
			});
		}
	},

	// Add a bloodpool to the room
	addBloodpool: function(x, y, rotation = 0) {
		var $div = $("<div>");
		$div.addClass("bloodpool")
			.css({
				left: GAME.tileSize * x,
				top: GAME.tileSize * y,
				transform: 'rotate('+rotation+')'
			});
		$("#room"+GAME.currentRoom).append($div);
	}

};
