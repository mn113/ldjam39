/* global $ */
"use strict";

var GAME = GAME || {};
GAME.utils = GAME.utils || {};

GAME.worldRotateZ = 45;
GAME.worldScale = 1;

// On jQ load:
$(function() {
	GAME.utils.bindEventsToCurrentRoom();

	// Inventory:
	$("#inventory").on('click', function(event) {
		console.log(event.target);
		// Show confirmation question:
		GAME.ui.showQuestion('Use', event.target.classList[0]);
	});
});

// Attach click, drag and scroll events to room div which is "current":
GAME.utils.bindEventsToCurrentRoom = function() {
	var clickXPos,
		curDown = false;
	var $world = $("#world");
	var $currentRoom = $("#room"+GAME.currentRoom);
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
		// Keep track of cursor position and whether button is up or down
		// TODO: find out how to add touch events for mobile users
		clickXPos = e.pageX;
		curDown = true;
	})
	.on('mouseup', function() {
		curDown = false;
	})
	.on('wheel', function(e) {
		var deltaY = e.deltaY || e.originalEvent.deltaY || 0;
		console.log("wheel", deltaY);
		if (deltaY < 0 && GAME.worldScale < 1.7) GAME.worldScale += 0.1;
		if (deltaY > 0 && GAME.worldScale > 0.3) GAME.worldScale -= 0.1;
		$("#world").css({
			transform: "scale("+GAME.worldScale+")"
		});
	});

	// Player walks to click:
	$currentRoom.on('mouseup', function(event) {
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
		//if (deltaZ > 0.2 * GAME.tileSize)
			//return;

		// Move debugging pixel:
		$pixel
			.appendTo($target)
			.css({
				left: event.offsetX,
				top: event.offsetY
				// z must come from target z + dz
			});

		console.log("Clicked target", $target, ", parent", $parent, event);

		// .room		(rel)		// we always want x/y relative to room's top left
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
			// Keep un-nesting the position until we hit .room:
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
		}, function() {
			// Handle an exit tile if stepped on:
			if ($parent.hasClass('exit')) {
				var destRoom = $parent.data("dest-room"),
					destExit = $parent.data("dest-exit");

				console.log("Exit", destRoom + destExit/10, "triggered");
				// Find Exit object and use it:
				GAME.rooms[GAME.currentRoom].contents.exits[destExit].exitFrom();
			}
		});

		// Centre world around player AFTER movement:
		setTimeout(GAME.utils.centrePlayer, 500);
	});

};
