//import Phaser from "phaser"
let text;
export default class startScreen extends Phaser.Scene{
	constructor(){
		super("startScreen");
		this.spacePressed = false;
	}
	
	preload(){
		
	}
	
	create(){
		text = this.add.text(200, 150, "Click Space To Start!", {
			fontSize: "24px",
			fill: "#fff",
		});
		this.input.keyboard.on("keydown-SPACE", () => this.spacePressed = true)
	}
	
	update(){
		if(this.spacePressed == true){
			this.scene.start("gameScene")
		}
	}
}