/* global $ */
"use strict";

var GAME = GAME || {};

GAME.utils = {
	switchRoom: function(oldRoomId, newRoomId, spawnPt) {	// default spawnPt already passed
		console.log("Switching to room", newRoomId);
		// Load the room if it is not in memory:
		if (!GAME.rooms[newRoomId].loaded) {
			console.log("Room not present");
			GAME.utils.loadRoom(newRoomId, function() {
				// Try again:
				GAME.utils.switchRoom(oldRoomId, newRoomId, spawnPt);	// FIXME: will give infinite loop if file not found
			});
		}
		else {
			// Get default room spawnPt if none passed:
			if (typeof spawnPt === 'undefined') spawnPt = GAME.rooms[newRoomId].respawn;

			// Visual slide effect:
			$("#room"+oldRoomId).fadeOut(1000);
			$("#room"+newRoomId).fadeIn(1000);
			GAME.currentRoom = newRoomId;
			GAME.player.respawn(newRoomId, spawnPt);
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

	// Load and execute a javascript file:
	loadScript: function(name) {
	},

	// Rotate the stage around a central Z-axis
	rotateWorld: function() {
		GAME.rooms[GAME.currentRoom].stage.rotationZ(GAME.worldRotateZ).update();
		// Keep player facing the camera:
		// TODO: replicate for all sprite2d's
		GAME.player.face(360 - GAME.worldRotateZ);

		GAME.utils.updateZIndexes();
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
