import gameScene from "./scene";
import Phaser from "phaser";
var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 400,
	fps: {
		target: 60,
	},
	transparent: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 300 },
			debug: true,
		},
	},
	scene: [gameScene],
};

var game = new Phaser.Game(config);