import Phaser from "phaser";

interface Player extends Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
	speed?: number;
	jumpVelocity?: number;
	score?: number;
	lives?: number;
	standing?: boolean;
}

interface MovingEnemey
	extends Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
	maxDistance?: number;
}

export default class gameScene extends Phaser.Scene {
	map: Phaser.Tilemaps.Tilemap;
	ground: Phaser.Tilemaps.TilemapLayer;
	coins: Phaser.Physics.Arcade.StaticGroup;
	coinsLayer: Phaser.Tilemaps.ObjectLayer;
	hearts: Phaser.Physics.Arcade.StaticGroup;
	heartsLayer: Phaser.Tilemaps.ObjectLayer;
	backgroundLight: Phaser.GameObjects.Light;
	heart: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	player: Player;
	lava: Phaser.Physics.Arcade.StaticGroup;
	lavaLayer: Phaser.Tilemaps.ObjectLayer;
	score: number;
	lives: number;
	scoreText: Phaser.GameObjects.Text;
	livesText: Phaser.GameObjects.Text;
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	tiles: Phaser.Tilemaps.Tileset;
	coinsArray: any;
	heartsArray: any;
	maxScore: number;
	jumpTimer: number;

	constructor() {
		super("gameScene");
		this.coinsArray = [];
		this.heartsArray = [];
	}

	init(data) {
		if (Object.keys(data).length === 0) {
			this.score = 0;
			console.warn(this.score);
			this.lives = 3;
			console.warn(this.lives);
		} else {
			this.score = data.score;
			this.lives = data.lives;
		}
		data = undefined;
	}

	preload() {
		this.load.audio("killEnemy", "assets/sounds/GameOver.wav");
		this.load.audio("pickupCoin", "assets/sounds/pickupCoin.wav");
		this.load.audio("jump", "assets/sounds/jump.wav");
		this.load.image("coin", "assets/images/coin.png");
		this.load.image("lava", "assets/images/lava.png");
		this.load.image("lava", "assets/images/lava.png");
		this.load.image("hero", "assets/images/hero.jpg");
		this.load.image("tiles", "assets/images/tilesheet.png");
		this.load.image("hearts", "assets/images/heart.png");
		this.load.tilemapTiledJSON("map", "assets/maps/lvl1.json");
	}
	create() {
		this.createMap();
		this.createPlayer();
		this.setCamera();
		this.addCollisions();
		this.addInput();
		this.addHud();
		this.createLights();
	}

	update() {
		this.movement();
		this.deathCheck();
	}

	createMap() {
		this.map = this.make.tilemap({
			key: "map",
		});
		this.tiles = this.map.addTilesetImage("tilesheet", "tiles");
		this.map.setCollisionBetween(0, 5);
		this.physics.world.setBounds(
			0,
			0,
			this.map.widthInPixels,
			this.map.heightInPixels
		);
		this.ground = this.map.createLayer("game", this.tiles, 0, 0);
		this.coins = this.physics.add.staticGroup();
		this.coinsLayer = this.map.getObjectLayer("coins");
		this.coinsLayer.objects.forEach((element) => {
			this.maxScore += 10;
			if (this.coinsArray.indexOf(element.id) !== -1) {
				let coin = this.coins.create(
					element.x + element.width / 2,
					element.y - element.height / 2,
					"coin"
				);
				coin.setOrigin(0.5, 0.5);
				coin.setPipeline("Light2D");
				coin.light = this.lights
					.addLight(coin.x, coin.y, 75)
					.setColor(0xffffff)
					.setIntensity(2);
				this.coinsArray.push(element.id);
				coin.id = element.id;
			}
		});
		this.hearts = this.physics.add.staticGroup();
		this.heartsLayer = this.map.getObjectLayer("hearts");
		this.heartsLayer.objects.forEach((element) => {
			if (this.heartsArray.indexOf(element.id) !== -1) {
				let heart = this.hearts.create(
					element.x + element.width / 2,
					element.y - element.height / 2,
					"hearts"
				);
				heart.setOrigin(0.5, 0.5);
				heart.setPipeline("Light2D");
				heart.light = this.lights
					.addLight(heart.x, heart.y, 75)
					.setColor(0xffffff)
					.setIntensity(2);
				this.heartsArray.push(element.id);
				heart.id = element.id;
			}
		});
		this.lava = this.physics.add.staticGroup();
		this.lavaLayer = this.map.getObjectLayer("lava");
		this.lavaLayer.objects.forEach((element) => {
			let lavaElement = this.lava.create(
				element.x + element.width / 2,
				element.y - element.height / 2,
				"lava"
			);
			lavaElement.setOrigin(0.5, 0.5);
			lavaElement.setPipeline("Light2D");
			lavaElement.light = this.lights
				.addLight(lavaElement.x, lavaElement.y, 75)
				.setColor(0xaaffff)
				.setIntensity(2);
		});
	}

	createPlayer() {
		this.player = this.physics.add.sprite(100, 200, "hero");
		this.player.score = this.score;
		this.player.lives = this.lives;
		this.player.speed = 350;
		this.player.jumpVelocity = -300;
		this.player.setCollideWorldBounds(true);
		this.player.setBounce(0);
		this.player.body.maxVelocity.x = 200;
		this.player.body.maxVelocity.y = 500;
		this.player.body.setGravityY(500);
	}

	setCamera() {
		this.cameras.main.setBounds(
			0,
			-100,
			this.map.widthInPixels,
			this.map.heightInPixels
		);
		this.cameras.main.startFollow(this.player, true, 0.05, 0, -200, 100);
	}

	addCollisions() {
		this.physics.add.collider(this.player, this.ground);
		this.physics.add.overlap(
			this.player,
			this.lava,
			this.playerDeath,
			null,
			this
		);

		this.physics.add.overlap(
			this.player,
			this.coins,
			this.collectCoin,
			null,
			this
		);
		this.physics.add.overlap(
			this.player,
			this.hearts,
			this.collectHeart,
			null,
			this
		);
	}
	playerDeath(player) {
		if (player.lives > 0) {
			player.lives -= 1;
			this.scene.start("gameScene", {
				lives: player.lives,
				score: player.score,
			});
		} else {
			this.endGame(false);
		}
	}

	addInput() {
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	addHud() {
		this.scoreText = this.add.text(
			16,
			50,
			"score: " + this.score.toString(),
			{
				fontSize: "24px",
			}
		);
		this.livesText = this.add.text(
			200,
			50,
			"lives: " + this.lives.toString(),
			{
				fontSize: "24px",
			}
		);
		this.scoreText.setScrollFactor(0);
		this.livesText.setScrollFactor(0);
	}

	movement() {
		this.player.standing =
			this.player.body.blocked.down || this.player.body.touching.down;

		if (this.cursors.left.isDown) {
			if (this.player.standing) {
				this.player.setVelocityX(-this.player.speed);
			} else {
				this.player.setVelocityX(-this.player.speed / 1.25);
			}
		} else if (this.cursors.right.isDown) {
			if (this.player.standing) {
				this.player.setVelocityX(this.player.speed);
			} else {
				this.player.setVelocityX(this.player.speed / 1.25);
			}
		} else {
			this.player.setVelocityX(0);
		}

		if (this.cursors.up.isDown) {
			if (this.player.standing && this.jumpTimer == 0) {
				this.jumpTimer = 1;
				this.player.setVelocityY(this.player.jumpVelocity);
				this.sound.play("jump");
			} else if (this.jumpTimer > 0 && this.jumpTimer < 31) {
				this.jumpTimer++;
				this.player.setVelocityY(
					this.player.jumpVelocity - this.jumpTimer * 0.5
				);
			}
		} else {
			this.jumpTimer = 0;
		}
	}

	deathCheck() {
		if (this.player.score == this.maxScore) {
			this.endGame(true);
		}
		if (this.player.y >= 500) {
			this.endGame(false);
			this.lives += -1;
		}
	}

	endGame(win) {
		if (win === true) {
			this.scene.start("endScreen", {
				score: this.player.score,
				win: true,
			});
		} else if (win === false) {
			this.scene.start("endScreen", {
				score: this.player.score,
				win: false,
			});
		}
	}

	collectCoin(player, coin) {
		coin.disableBody(true, true);
		this.lights.removeLight(coin.light);
		this.player.score += 10;
		this.scoreText.setText("Score: " + this.player.score);
		this.sound.play("pickupCoin");
		this.coinsArray.pop(this.coinsArray.indexOf(coin.id));
	}

	collectHeart(player, heart) {
		heart.disableBody(true, true);
		this.player.lives++;
		this.livesText.setText("lives: " + this.player.lives);
		this.heartsArray.pop(this.heartsArray.indexOf(heart.id));
	}

	createLights() {
		this.ground.setPipeline("Light2D");
		this.player.setPipeline("Light2D");
		this.lights.enable().setAmbientColor(0x777777);
		this.backgroundLight = this.lights
			.addLight(this.player.x, this.player.y, 100000)
			.setColor(0xffffff)
			.setIntensity(0.0008);
	}
}
