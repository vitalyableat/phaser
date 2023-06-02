import { Math, Scene } from 'phaser';
import { Actor } from './actor';
import { Player } from './player';
import { EVENT_NAMES } from '../constants';

export class Enemy extends Actor {
  private target: Player;
  private AGGRESSOR_RADIUS = 100;
  private attackHandler: () => void;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string,
    target: Player,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.target = target;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.getBody().setSize(16, 16);
    this.getBody().setOffset(0, 0);

    this.attackHandler = () => {
      if (
        Math.Distance.BetweenPoints(
          { x: this.x, y: this.y },
          { x: this.target.x, y: this.target.y }
        ) < this.target.width
      ) {
        this.getDamage();
        this.disableBody(true, false);
        this.scene.time.delayedCall(300, () => {
          this.destroy();
        });
      }
    };

    this.scene.game.events.on(EVENT_NAMES.ATTACK, this.attackHandler, this);
    this.on('destroy', () => {
      this.scene.game.events.removeListener(EVENT_NAMES.ATTACK, this.attackHandler);
    });
  }

  preUpdate(): void {
    Math.Distance.BetweenPoints({ x: this.x, y: this.y }, { x: this.target.x, y: this.target.y }) <
    this.AGGRESSOR_RADIUS
      ? this.getBody().setVelocity(this.target.x - this.x, this.target.y - this.y)
      : this.getBody().setVelocity(0);
  }

  public setTarget(target: Player): void {
    this.target = target;
  }
}
