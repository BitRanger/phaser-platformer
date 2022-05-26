// import Phaser from "phaser";

export default class startScreen extends Phaser.Scene {
	spacePressed: boolean;
	constructor() {
		super("startScreen");
		this.spacePressed = false;
	}

	preload() {}

	create() {
		this.add.text(190, 200, "Click Space To Play!", {
			fontSize: "50px",
		});

		this.add.text(200, 350, "Collect the Stars to Win", {
			fontSize: "40px",
		});

		this.input.keyboard.on(
			"keydown-SPACE",
			() => (this.spacePressed = true)
		);
	}

	update() {
		if (this.spacePressed == true) {
			this.scene.start("gameScene", {
				score: 0,
				lives: 5,
				first_load: true,
				coinsArray: [],
				heartsArray: [],
				level: 1,
				levelScore: 0,
			});
		}
	}
}
