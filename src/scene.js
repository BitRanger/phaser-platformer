// import Phaser from "phaser";
let player,
	coins,
	floor,
	platforms,
	cursors,
	score = 0,
	hud,
	scoreText, 
	acceleration = 350,
	jumpVelocity = -250,
	jumptimer = 0,
	emitter;

export default class gameScene extends Phaser.Scene {
	constructor() {
		super("gameScene");
		this.spacePressed = false;
	}
	preload() {
        this.load.image("coin", "/assets/images/coin.png");
		this.load.image("ground-1", "/assets/images/ground-1.png");
		this.load.image("ground-2", "/assets/images/ground-2.png");
		this.load.image("hero", "/assets/images/hero.jpg");
	}

	create() {
		/*  map  */
		this.physics.world.setBounds(0, 50, 1630, 500);
		//platforms
		floor = this.physics.add.staticGroup({
			key: "ground-1",
			repeat: 50,
			setXY: {
				x: 0,
				y: 400,
				stepX: 32,
			}, 
		});

		floor.create(200,200, "ground-1");
        
		
        platforms = this.physics.add.staticGroup({
			key: "ground-2",
			repeat: 50,
			setXY: {
				x: 0,
				y: 430,
				stepX: 32,
			}, 
		});
	

		
		//coins
		coins = this.physics.add.group({
			key: "coin",
			repeat: 11,
			setXY: {
				x: 12,
				y: 0,
				stepX: 70,
			},
		});

		coins.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});


		//player
		player = this.physics.add.sprite(100, 350, "hero");
		player.setCollideWorldBounds(true);
		player.setBounce(0);
		player.body.maxVelocity.x = 200;
		player.body.maxVelocity.y = 500;
		player.body.setGravityY(300);
		
		//camera boundaries / following player
    	this.cameras.main.setBounds(0, 30, 1630, 450);
		this.cameras.main.startFollow(player, true, 0.05, 0, -200, 100);
		
		//input
		cursors = this.input.keyboard.createCursorKeys();
		this.input.keyboard.on("keydown-SPACE", () => this.spacePressed = true);		
		//collisions
		this.physics.add.collider(player, floor);
		this.physics.add.collider(coins, floor);
		this.physics.add.overlap(player, coins, this.collectCoin, null, this);

		//hud
		scoreText = this.add.text(16, 50, "score: 0", {
			fontSize: "24px",
			fill: "#fff",
		});
		scoreText.setScrollFactor(0);
		var particles = this.add.particles("coin");
		emitter = particles.createEmitter();
		emitter.setPosition(player.x, player.y);
		emitter.setSpeed(150);
		emitter.setBlendMode(Phaser.BlendModes.ADD);
		emitter.pause();
	}

	update() {
		//check for grounded
		let standing = player.body.blocked.down || player.body.touching.down;

		//left input
		if (cursors.left.isDown) {
			if (standing) {
				player.setVelocityX(-acceleration);
			}
			else {
				player.setVelocityX(-acceleration / 1.25);
			}
		}
		//right input
		else if (cursors.right.isDown) {
			if (standing) {
				player.setVelocityX(acceleration);
			} else {
				player.setVelocityX(acceleration / 1.25);
			}
		}

		//no left-right input
		else {
			player.setVelocityX(0);
		}
        
		//jumping
		if (cursors.up.isDown) {
			if (standing && jumptimer == 0) {
				jumptimer = 1;
				player.setVelocityY(jumpVelocity);
			} else if (jumptimer > 0 && jumptimer < 31) {
				jumptimer++;
				player.setVelocityY(jumpVelocity - jumptimer * 0.5);
			}
		} else {
			jumptimer = 0;
		}
        
		//Game  Over 
        if (player.y >= 500) {
    	    this.scene.start("endScreen", {score})
        }
		emitter.setPosition(player.x, player.y);
		if(this.spacePressed == true){
			if(emitter.active){
				emitter.pause();
			}
			else{
				emitter.resume();
			}
			this.spacePressed = false;
		}
	}

	collectCoin(player, coin) {
		coin.disableBody(true, true);
		score += 10;
		scoreText.setText("Score: " + score);
	}
}