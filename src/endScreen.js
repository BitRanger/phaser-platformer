let text2,
	text3,
	text4,
	score = 0,
	win;

export default class endScreen extends Phaser.Scene {
	constructor() {
		super("endScreen");
		this.spacePressed = false;
	}

	init(data) {
		score = data.score;
		if(data.hasOwnProperty(win)){
			win = data.win
		}
		else{
			win = false;
		}
	}
	preload() {}

	create() {
		if(win){
		text2 = this.add.text(200, 150, "get destroyed noob L", {
			fontSize: "50px",
			fill: "#fff",
		});
		}
		else{
		text2 = this.add.text(200, 150, "idk u won", {
			fontSize: "50px",
			fill: "#fff",
		});
	
		}
		text4 = this.add.text(200, 250, "Score: ", {
			fontSize: "50px",
			fill: "#fff",
		});
		text3 = this.add.text(250, 300, score, {
			fontSize: "50px",
			fill: "#fff",
		});
		this.add.text(350, 250, "press space 2 replay idk this is just a protoype");
		this.input.keyboard.on(
			"keydown-SPACE",
			() => (this.spacePressed = true)
		);
	}

	update() {
		if (this.spacePressed === true) {
			this.scene.start("gameScene");
		}
	}
}
