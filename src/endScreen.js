//import Phaser from "phaser";
let text2, text3, text4;
let score = 0;

export default class endScreen extends Phaser.Scene{
	constructor(){
		super("endScreen");
		this.spacePressed = false;
	}

    init(data){
        score = data.score;
    }
	preload(){
		
	}
	
	create(){
        text2 = this.add.text(200, 150, "End Screen!", {
			fontSize: "50px",
			fill: "#fff",
	    });
        text4 = this.add.text(200, 250, "Score: ", {
			fontSize: "50px",
			fill: "#fff",
        });
        text3 = this.add.text(250, 300, score, {
			fontSize: "50px",
			fill: "#fff",
	    });
		this.input.keyboard.on("keydown-SPACE", () => this.spacePressed = true);
    }
    
	update(){
        if(this.spacePressed === true){
			this.scene.start("gameScene");
        }
	}
	
}
