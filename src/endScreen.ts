// import Phaser from "phaser";

export default class endScreen extends Phaser.Scene {
	text2: Phaser.GameObjects.Text;
	text4: Phaser.GameObjects.Text;
	score: number;
	win: boolean;
	constructor() {
		super("endScreen");
	}

	init(data) {
		if (Object.keys(data).length !== 0) {
			this.score = data.score;
			this.win = data.win;
		} else {
			this.score = 100;
			this.win = false;
		}
	}
	preload() {}

	create() {
		if (this.win) {
			this.add.text(360, 200, "You Win!", {
				fontSize: "50px",
			});
		} else {
			this.add.text(350, 200, "You Died!", {
				fontSize: "50px",
			});
		}
		this.add.text(256, 300, "Final Score: " + this.score.toString(), {
			fontSize: "50px",
		});

		this.add.text(280, 400, "Click Space To Restart!", {
			fontSize: "30px",
		});

		this.input.keyboard.on("keydown-SPACE", () => {
			this.scene.start("gameScene", {
				score: 0,
				lives: 1,
				first_load: true,
				coinsArray: [],
				heartsArray: [],
				level: 1,
				levelScore: 0,
			});
		});
	}

	update() {}
}
