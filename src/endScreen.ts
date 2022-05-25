// import Phaser from "phaser";

export default class endScreen extends Phaser.Scene {
	text2: Phaser.GameObjects.Text;
	text4: Phaser.GameObjects.Text;
	text3: Phaser.GameObjects.Text;
	score: number;
	win: boolean;
	constructor() {
		super("endScreen");
	}

	init(data) {
		this.score = data.score;
		this.win = data.win;
	}
	preload() {}

	create() {
		console.log(this.win);
		if (this.win) {
			this.text2 = this.add.text(200, 150, "idk u won", {
				fontSize: "50px",
			});
		}
		else {
			this.text2 = this.add.text(200, 150, "get destroyed noob L", {
				fontSize: "50px",
			});
		}
		this.text4 = this.add.text(200, 250, "Score: ", {
			fontSize: "50px",
		});
		this.text3 = this.add.text(250, 300, this.score.toString(), {
			fontSize: "50px",
		});
		this.input.keyboard.on("keydown-SPACE", () => {
			this.scene.start("gameScene", {
				score: 0,
				lives: 3,
				first_load: true,
				coinsArray: [],
				heartsArray: [],
				level: 1,
			});
		});
	}

	update() {}
}
