// import Phaser from "phaser";
import gameScene from "./scene.js";
import startScreen from "./startScreen.js";
import endScreen from "./endScreen.js";
var config = {
	type: Phaser.AUTO,
	width: 960,
	maxLights: 50,
	height: 640,
	fps: {
		target: 60,
		// forceSetTimeOut: true,
	},
	transparent: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 300 },
			// debug: true,
		},
	},
	scene: [startScreen, gameScene, endScreen], //startScreen, gameScene,
};

var game = new Phaser.Game(config);
