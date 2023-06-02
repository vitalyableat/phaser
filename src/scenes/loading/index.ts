import { Scene } from 'phaser';

export class LoadingScene extends Scene {
  constructor() {
    super('loading-scene');
  }

  preload() {
    this.load.baseURL = 'assets/';
    this.load.image('king', 'sprites/king.png');
    this.load.atlas('a-king', 'spritesheets/a-king.png', 'spritesheets/a-king_atlas.json');
    this.load.image('tiles', 'tilemaps/dungeon-16-16.png');
    this.load.tilemapTiledJSON('dungeon', 'tilemaps/dungeon.json');
    this.load.spritesheet('tiles_spr', 'tilemaps/dungeon-16-16.png', {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {
    this.scene.start('level-1-scene');
    this.scene.start('ui-scene');
  }
}
