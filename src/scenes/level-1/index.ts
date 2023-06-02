import { Scene, Tilemaps, GameObjects } from 'phaser';
import { Player } from '../../classes/player';
import { gameObjectsToObjectPointsAdapter } from '../../utils';
import { EVENT_NAMES } from '../../constants';
import { Enemy } from '../../classes/enemy';

export class Level1 extends Scene {
  private player!: Player;
  private map!: Tilemaps.Tilemap;
  private tileset!: Tilemaps.Tileset;
  private wallsLayer!: Tilemaps.TilemapLayer;
  private groundLayer!: Tilemaps.TilemapLayer;
  private chests!: GameObjects.Sprite[];
  private enemies!: Enemy[];

  constructor() {
    super('level-1-scene');
  }

  create() {
    this.initMap();
    this.player = new Player(this, 100, 100);
    this.physics.add.collider(this.player, this.wallsLayer);
    this.showDebugWalls();
    this.initChests();
    this.initCamera();
    this.initEnemies();
  }

  update() {
    this.player.update();
  }

  private initMap(): void {
    this.map = this.make.tilemap({ key: 'dungeon', tileWidth: 16, tileHeight: 16 });
    this.tileset = this.map.addTilesetImage('dungeon', 'tiles');
    this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0);
    this.wallsLayer = this.map.createLayer('Walls', this.tileset, 0, 0);
    this.physics.world.setBounds(0, 0, this.wallsLayer.width, this.wallsLayer.height);
    this.wallsLayer.setCollisionByProperty({ collides: true });
  }

  private initChests(): void {
    const chestPoints = gameObjectsToObjectPointsAdapter(
      this.map.filterObjects('Chests', (obj) => obj.name === 'ChestPoint') || []
    );
    this.chests = chestPoints.map((chestPoint) =>
      this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 595).setScale(1.5)
    );
    this.chests.forEach((chest) => {
      this.physics.add.overlap(this.player, chest, (_, obj2) => {
        this.game.events.emit(EVENT_NAMES.CHEST_LOOT);
        obj2.destroy();
        this.cameras.main.flash();
      });
    });
  }

  private initCamera(): void {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setZoom(2);
  }

  private initEnemies(): void {
    const enemiesPoints = gameObjectsToObjectPointsAdapter(
      this.map.filterObjects('Enemies', (obj) => obj.name === 'EnemyPoint')
    );
    this.enemies = enemiesPoints.map((enemyPoint) =>
      new Enemy(this, enemyPoint.x, enemyPoint.y, 'tiles_spr', this.player, 503)
        .setName(enemyPoint.id.toString())
        .setScale(1.5)
    );
    this.physics.add.collider(this.enemies, this.wallsLayer);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.player, this.enemies, (obj1, obj2) => {
      (obj1 as Player).getDamage(1);
    });
  }

  private showDebugWalls(): void {
    const debugGrapicks = this.add.graphics().setAlpha(0.7);
    this.wallsLayer.renderDebug(debugGrapicks, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(200, 200, 100, 255)
    });
  }
}
