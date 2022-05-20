let player,
	coins,
	floor,
	platforms,
	cursors,
	standing,
	tiles,
	score = 0,
	scoreText,
	acceleration = 350,
	jumpVelocity = -250,
	jumptimer = 0;

export default class gameScene extends Phaser.Scene {
	constructor() {
		super("gameScene");
		this.spacePressed = false;
		this.ground;
		this.map;
	}
	preload() {
		this.load.image("coin", "/assets/images/coin.png")
		this.load.image("hero", "/assets/images/hero.jpg");
		this.load.image("tiles", "/assets/images/tilesheet.png");
		this.load.tilemapTiledJSON("map", "/assets/maps/lvl1.json");
	}

	create() {
		/*  map  */
		this.map = this.make.tilemap({ key: "map" });
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
		this.coinsLayer = this.map.getObjectLayer('coins');
		this.coinsLayer.objects.forEach(element => { 
			let coin = this.coins.create(element.x + (element.width / 2), element.y - (element.height / 2), "coin");
			coin.setOrigin(0.5,0.5)
		})




		//player
		player = this.physics.add.sprite(100, 200, "hero");
		player.setCollideWorldBounds(true);
		player.setBounce(0);
		player.body.maxVelocity.x = 200;
		player.body.maxVelocity.y = 500;
		player.body.setGravityY(300);

		//camera boundaries / following player
		this.cameras.main.setBounds(0, 30, this.map.widthInPixels, 450);
		this.cameras.main.startFollow(player, true, 0.05, 0, -200, 100);

		//input
		cursors = this.input.keyboard.createCursorKeys();

		//collisions
		this.physics.add.collider(player, this.ground);
		this.physics.add.overlap(player, this.coins, this.collectCoin, null, this);


		//hud
		scoreText = this.add.text(16, 50, "score: 0", {
			fontSize: "24px",
			fill: "#fff",
		});
		scoreText.setScrollFactor(0);
	}

	update() {
		//check for grounded
		standing = player.body.blocked.down || player.body.touching.down;

		//left input
		if (cursors.left.isDown) {
			if (standing) {
				player.setVelocityX(-acceleration);
			} else {
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
			this.scene.start("endScreen", { score });
		}
	}

	collectCoin(player, coin) {
		coin.disableBody(true, true);
		score += 10;
		scoreText.setText("Score: " + score);
	}
}
