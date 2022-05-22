let player,
	enemy,
	coins,
	cursors,
	standing,
	tiles,
	score = 0,
	scoreText,
	lives = 2,
    maxLives = 3,
	maxScore = 0,
	livesText,
	acceleration = 350,
	jumpVelocity = -300,
	jumptimer = 0;

export default class gameScene extends Phaser.Scene {
	constructor() {
		super("gameScene");
	}

	preload() {
        this.load.audio("killEnemy", "assets/sounds/GameOver.wav");
        this.load.audio("pickupCoin", "assets/sounds/pickupCoin.wav");
		this.load.audio("jump", "assets/sounds/jump.wav");
		this.load.image("coin", "assets/images/coin.png");
		this.load.image("hero", "assets/images/hero.jpg");
		this.load.image("lava", "assets/images/lava.png");
		this.load.image("tiles", "assets/images/tilesheet.png");
		this.load.image("hearts", "assets/images/heart.png");
		this.load.tilemapTiledJSON("map", "assets/maps/lvl2.json");
	}
	create() {
		this.createMap();
		this.createPlayer();
		this.setCamera();
		enemy = this.physics.add.sprite(300, 200, "lava");
		this.addCollisions();
		this.addInput();
		this.addHud();
		this.createLights();
		this.physics.add.collider(player, enemy, this.playerEnemyCollide, null, this);
		this.heart = this.physics.add.sprite(100, 100, "hearts");
		this.physics.add.overlap(player, this.heart, this.collectHeart, null, this)
		this.physics.add.collider(this.heart, this.ground);
	}

	update() {
		this.movement();
		this.deathCheck();
	}

	collectHeart(player, heart){
		heart.disableBody(true, true);
		lives++;
		livesText.setText("lives: " + lives);
	}
	
	playerEnemyCollide() {
		if (player.body.touching.down && enemy.body.touching.up) {
			enemy.disableBody(true, true)
            this.sound.play("killEnemy");
		} else {
			if (lives > 0 ){
				player.x = 200;
				player.y = 200;
				lives--;
				livesText.setText("lives: " + lives);
			} else {
				this.endGame(false);
			}
		}
	}
	
	createMap() {
		this.map = this.make.tilemap({
			key: "map"
		});
		tiles = this.map.addTilesetImage("tilesheet", "tiles");
		this.map.setCollisionBetween(0, 5);
		this.physics.world.setBounds(
			0,
			0,
			this.map.widthInPixels,
			this.map.heightInPixels
		);
		this.ground = this.map.createLayer("game", tiles, 0, 0);
		this.coins = this.physics.add.staticGroup();
		this.coinsLayer = this.map.getObjectLayer("coins");
		this.coinsLayer.objects.forEach((element) => {
			maxScore += 10;
			let coin = this.coins.create(
				element.x + element.width / 2,
				element.y - element.height / 2,
				"coin"
			);
			coin.setOrigin(0.5, 0.5);
			coin.setPipeline("Light2D");
			coin.light = this.lights.addLight(coin.x, coin.y, 75).setColor(0xffffff).setIntensity(2);
            
		});
        this.hearts = this.physics.add.staticGroup();
		this.heartsLayer = this.map.getObjectLayer("hearts");
		this.heartsLayer.objects.forEach((element) => {
			maxLives += 1;
			let hearts = this.hearts.create(
				element.x + element.width / 2,
				element.y - element.height / 2,
				"hearts"
			);
			hearts.setOrigin(0.5, 0.5);
			hearts.setPipeline("Light2D");
			hearts.light = this.lights.addLight(hearts.x, hearts.y, 75).setColor(0xffffff).setIntensity(2);
		});
	}

	createPlayer() {
		player = this.physics.add.sprite(100, 200, "hero");
		player.setCollideWorldBounds(true);
		player.setBounce(0);
		player.body.maxVelocity.x = 200;
		player.body.maxVelocity.y = 500;
		player.body.setGravityY(500);
	}

	setCamera() {
		this.cameras.main.setBounds(
			0,
			-100,
			this.map.widthInPixels,
			this.map.heightInPixels
		);
		this.cameras.main.startFollow(player, true, 0.05, 0, -200, 100);
	}

	addCollisions() {
		this.physics.add.collider(player, this.ground);
		this.physics.add.overlap(player, this.coins, this.collectCoin, null, this);
		this.physics.add.collider(enemy, this.ground);
	}
	
	addInput() {
		cursors = this.input.keyboard.createCursorKeys();
	}

	addHud() {
		scoreText = this.add.text(16, 50, "score: 0", {
			fontSize: "24px",
			fill: "#fff",
		});
		livesText = this.add.text(200, 50, "lives: 3", {
			fontSize: "24px",
			fill: "#fff",
		});
		scoreText.setScrollFactor(0);
		livesText.setScrollFactor(0);
	}

	movement() {
		standing = player.body.blocked.down || player.body.touching.down;

		if (cursors.left.isDown) {
			if (standing) {
				player.setVelocityX(-acceleration);
			} else {
				player.setVelocityX(-acceleration / 1.25);
			}
		} else if (cursors.right.isDown) {
			if (standing) {
				player.setVelocityX(acceleration);
			} else {
				player.setVelocityX(acceleration / 1.25);
			}
		} else {
			player.setVelocityX(0);
		}

		if (cursors.up.isDown) {
			if (standing && jumptimer == 0) {
				jumptimer = 1;
				player.setVelocityY(jumpVelocity);
				this.sound.play("jump");
			} else if (jumptimer > 0 && jumptimer < 31) {
				jumptimer++;
				player.setVelocityY(jumpVelocity - jumptimer * 0.5);
			}
		} else {
			jumptimer = 0;
		}
	}

	deathCheck() {
		if (score == maxScore) {
			this.endGame(true);
		}
		if (player.y >= 500) {
			this.endGame(false);
		}
	}

	endGame(thing) {
		if (thing === true) {
			this.scene.start("endScreen", { score, win: true});

		} else if (thing === false) {
			this.scene.start("endScreen", { score, win: false});
		}
	}

	collectCoin(player, coin) {
		coin.disableBody(true, true);
		this.lights.removeLight(coin.light);
		score += 10;
		scoreText.setText("Score: " + score);
        this.sound.play("pickupCoin"); 
	}
	
	createLights() {
		this.ground.setPipeline("Light2D");
		player.setPipeline("Light2D");
		enemy.setPipeline("Light2D")
		this.lights.enable().setAmbientColor(0x333333);
		this.thing = this.lights
			.addLight(player.x, player.y, 100000)
			.setColor(0xffffff)
			.setIntensity(0.0006);
	}
}
