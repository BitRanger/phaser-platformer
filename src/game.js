import gameScene from "./scene.js";
import startScreen from "./startScreen.js";
import endScreen from "./endScreen.js";
var config = {
	type: Phaser.AUTO,
	width: 960,
	height: 640,
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
	scene: [startScreen, gameScene, endScreen],
};

var game = new Phaser.Game(config);
