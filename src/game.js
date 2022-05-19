// import Phaser from "phaser";
import gameScene from "./scene.js";
import startScreen from "./startScreen.js"
import endScreen from "./endScreen.js"

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 400,
	fps: {
		target: 60,
		// forceSetTimeOut: true,
	},
	transparent: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 300 },
			debug: false,
		},
	},
	scene: [startScreen, gameScene, endScreen],
};

var game = new Phaser.Game(config);