/* global $ */
"use strict";

var GAME = GAME || {};

GAME.currentAct = 1;
GAME.avatars = {
	'npc-m1': {

	},
	'npc-f1': {

	},
	'npc-father': {

	},
	'npc-mother': {

	}
};

GAME.dialogue = {
	act1: {
		player: [
			"Samantha Pettymore, travel writer. How do you do?",
			"Why is everyone ignoring me around here?",
			"Hello? What's the matter, cat got your tongue?"
		],
		npc: [
			"Cough cough.",
			"Don't bother trying. You'll never succeed.",
			"I'm pleased you're here. But stop pretending."
		]
	}
};

GAME.ui = {

	updateBar() {
		this.updateDeathCount();
		this.updatePlacename();
	},

	// Show the current death count in blocks of 5 and singles, in the UI bar:
	updateDeathCount() {
		var $count = $("#count"),
			d = GAME.player.deaths,
			fives = Math.floor(d/5),
			ones = d % 5;
		$count.html("");	// empty it first
		while (fives > 0) {
			$count.append($("<i>").addClass("fiver"));
			fives--;
		}
		while (ones > 0) {
			$count.append($("<i>").addClass("single"));
			ones--;
		}
	},

	// Show what room we're in, in the UI bar:
	updatePlacename() {
		$("#placename").html(GAME.rooms[GAME.currentRoom].name);
	},

	// Keep the inventory items up-to-date, in the UI bar:
	updateInventory() {
		//TODO
	},

	// Show an overlay with an image, heading and text:
	showSuccessMessage: function(deathData) {
		console.log("Achievement unlocked: " + deathData.title);
		var $dialog = $("<div>").addClass("dialog");
		$dialog.append($("<img>").attr("src", deathData.icon));
		$dialog.append($("<div>").addClass("message").html(
			`<h2>${deathData.title}</h2>
			<p>${deathData.text}</p>`
		));
		$("#ui").append($dialog);

		// Wait then remove it:
		setTimeout(function() {
			$dialog.fadeOut(700).remove();
		}, 2300);
	},

	// Show overlay with speech and character's avatar:
	// Talking to NPCs triggers an NPC speech
	// Respawning triggers a player speech
	showSpeech: function(character, lineId = 0) {
		// Take lines one by one from the top by default:
		var line = GAME.dialogue['act'+GAME.currentAct][character][lineId];
		delete GAME.dialogue['act'+GAME.currentAct][character][lineId];	// sets undefined

		if (typeof line === 'undefined')
			return;

		var $dialog = $("<div>").addClass("dialog");
		$dialog.append(
			$("<div>").addClass("avatar "+character)
				.addClass(character === 'player' ? 'left' : 'right')	// different avatar positions
		);
		$dialog.append(
			$("<div>").addClass("message")
				.append($("<blockquote>").html(line))
		);
		$("#ui").append($dialog);

		// Wait then remove it:
		setTimeout(function() {
			$dialog.fadeOut(700).remove();
		}, 2500);
	},

	// shopDialog
	showShop: function(shopId) {

	},

	// titleScreen
	showTitles: function() {

	},

	// credits
	showCredits() {

	}
};
