/* global $ */
"use strict";

var GAME = GAME || {};

GAME.worldRotateZ = 45;

$(function() {

	var clickXPos,
		curDown = false;
	// Select a bunch of important elements with jQuery:
	var $world = $("#world");
	var $room = $("#room");
	var $base = $("#baseplate"+GAME.currentRoom);
	var $pixel = $("#pixel");


	// Convert side-to-side mouse drags to +/- Z-rotation:
	$world.on('mousemove', function(e) {
		var sign;
		if (curDown) {
			if (Math.abs(e.pageX - clickXPos) > 5) {
				sign = (e.pageX >= clickXPos) ? 1 : -1;
				GAME.worldRotateZ -= sign * 0.5 * Math.log(Math.abs(e.pageX - clickXPos));
				// Rotate room:
				GAME.utils.rotateWorld();
			}
		}
	})
	.on('mousedown', function(e) {
		// Keep track of cursor position and whether button is up or dropdown
		// TODO: find out how to add touch events for mobile users
		clickXPos = e.pageX;
		curDown = true;
	})
	.on('mouseup', function() {
		curDown = false;
	})
	.on('wheel', function(e) {
		console.log(e);	// PROBLEM: no e.deltaY
	});

	// Player walks to click:
	$room.on('mouseup', function(event) {
		var player = GAME.player;
		var $target = $(event.target);
		var $parent = $target.parent();
		var targetPoint;

		// Don't walk if we're currently dragging world:
		if (clickXPos !== event.pageX)
			return;

		// Don't walk if invalid surface clicked:
		if (!$target.hasClass('top'))
			return;

		// Read data-z of tile for height calculation:
		var targetZ =  parseInt($target.parent().data('z')) || 0;
		// Don't walk if required to climb/descend over 0.2 units:
		console.log(GAME.player.el.z());
		var deltaZ = Math.abs(targetZ - GAME.player.el.z()) - 20;	// TODO: fix z-fudge
		console.log("dZ =", deltaZ);
		if (deltaZ > 0.2 * GAME.tileSize)
			return;

		// Move debugging pixel:
		$pixel
			.appendTo($target)
			.css({
				left: event.offsetX,
				top: event.offsetY
				// z must come from target z + dz
			});

		console.log("Clicked target", $target, ", parent", $parent, event);

		// #room		(rel)		// we always want x/y relative to room's top left
		// 	#baseplate0	(abs)
		// 	  .top		(abs)	<- click
		// 	.newcube	(abs)
		// 	  .top		(abs)	<- click

		// Find absolute floor coordinates of point (local x/y + parent element top/left):
		var $el = $target,
			level = 0;
		targetPoint = {
			x: event.offsetX,	// parent relative
			y: event.offsetY
		};
		console.log("tp", targetPoint);

		// Find absolute floor coordinates of point (local x/y + parent element top/left):
		if ($target !== $base) {
			// Target is nested
			// Keep un-nesting the position until we hit #room:
			do {
				targetPoint.x += parseInt($el[0].style.left || 0) * GAME.tileSize;
				targetPoint.y += parseInt($el[0].style.top || 0) * GAME.tileSize;
				console.log(level, $el, $el[0].style.left, $el[0].style.top);
				console.log("tp", targetPoint);
				$el = $el.parent();
				level++;
				if (level > 3) break;
			} while ($el.attr("id") !== 'room');
			console.log(targetPoint, level+" levels traversed");
		}

		// Go to clicked pixel and set sprite z:
		console.log("Setting Z", targetZ);
		player.walkTo({
			x: targetPoint.x - 8,
			y: targetPoint.y - 24,
			z: targetZ
		});

		// Centre world around player AFTER movement:
		setTimeout(GAME.utils.centreMan, 500);
	});

}); // end of jQuery onload wrapper

GAME.utils = {
	rotateWorld: function() {
		GAME.stage.rotationZ(GAME.worldRotateZ).update();
		// Keep player facing the camera:
		// TODO: replicate for all sprite2d's
		GAME.player.face(360 - GAME.worldRotateZ);

		GAME.utils.updateZIndexes();
	},

	// Function to pan the room to keep the player roughly central on the screen
	centreMan: function() {	// TODO: use while loops to make it smoother
		var $room = $("#room");
		var $player = GAME.player.jqEl;

		if ($player.offset().left - window.innerWidth / 2 > 150) {
			$room.css({"margin-left": "-=150px"});
		}
		else if ($player.offset().left - window.innerWidth / 2 < -150) {
			$room.css({"margin-left": "+=150px"});
		}
		if ($player.offset().top - window.innerHeight / 2 > 150) {
			$room.css({"margin-top": "-=150px"});
		}
		else if ($player.offset().top - window.innerHeight / 2 < -150) {
			$room.css({"margin-top": "+=150px"});
		}
	},

	// Set the z-index of every element in the room, to be its screen y-coordinate.
	// By doing the same to the player sprite, we should get the correct layering effect
	updateZIndexes: function(onlyUpdatePlayer = false) {
		if (onlyUpdatePlayer) {
			GAME.player.el.style.zIndex = parseInt(GAME.player.jqEl.offset().top);
		}
		else {
			$("#room > *").each(function() {
				// y-coord becomes z-index:
				this.style.zIndex = parseInt($(this).offset().top);
			});
		}
	},

	// Add a bloodpool to the stage
	addBloodpool: function(x, y, rotation = 0) {
		var $div = $("<div>");
		$div.addClass("bloodpool")
			.css({
				left: GAME.tileSize * x,
				top: GAME.tileSize * y,
				transform: 'rotate('+rotation+')'
			});
		$("#room").append($div);
	}

};
