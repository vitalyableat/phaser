import { Scene } from 'phaser';
import { Score, ScoreOperations } from '../../classes/score';
import { EVENT_NAMES, GAME_STATUS } from '../../constants';
import { Text } from '../../classes/text';

export class UIScene extends Scene {
  private score!: Score;
  private chestLootHandler: () => void;
  private gameEndPhrase!: Text;
  private gameEndHandler: (status: GAME_STATUS) => void;
  private WIN_SCORE = 40;

  constructor() {
    super('ui-scene');
    this.chestLootHandler = () => {
      this.score.changeValue(ScoreOperations.INCREASE, 10);
      if (this.score.getValue() === this.WIN_SCORE) {
        this.game.events.emit(EVENT_NAMES.GAME_END, 'win');
      }
    };
    this.gameEndHandler = (status: GAME_STATUS) => {
      this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.6)');
      this.game.scene.pause('level-1-scene');
      this.gameEndPhrase = new Text(
        this,
        this.game.scale.width / 2,
        this.game.scale.height * 0.4,
        status === GAME_STATUS.LOSE
          ? `WASTED!\nCLICK TO RESTART`
          : 'YOU ARE ROCK!\nCLICK TO RESTART'
      )
        .setAlign('center')
        .setColor(status === GAME_STATUS.LOSE ? '#f00' : '#fff');
      this.gameEndPhrase.setPosition(
        this.game.scale.width / 2 - this.gameEndPhrase.width / 2,
        this.game.scale.height * 0.4
      );

      this.input.on('pointerdown', () => {
        this.game.events.off(EVENT_NAMES.CHEST_LOOT, this.chestLootHandler);
        this.game.events.off(EVENT_NAMES.GAME_END, this.gameEndHandler);
        this.scene.get('level-1-scene').scene.restart();
        this.scene.restart();
      });
    };
  }

  create() {
    this.score = new Score(this, 20, 20, 0);
    this.initListeners();
  }

  private initListeners(): void {
    this.game.events.on(EVENT_NAMES.CHEST_LOOT, this.chestLootHandler, this);
    this.game.events.once(EVENT_NAMES.GAME_END, this.gameEndHandler, this);
  }
}
