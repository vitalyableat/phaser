import { Game, Types, Scale } from 'phaser';
import { Level1, LoadingScene, UIScene } from './scenes';

const gameConfig: Types.Core.GameConfig = {
  title: 'Phaser Game',
  type: Phaser.WEBGL,
  parent: 'root',
  backgroundColor: '#351f1b',
  scale: {
    mode: Scale.ScaleModes.NONE,
    width: window.innerWidth,
    height: window.innerHeight
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  render: {
    antialiasGL: false,
    pixelArt: true
  },
  callbacks: {
    postBoot: () => {
      window.sizeChanged();
    }
  },
  canvasStyle: 'display: block; width: 100%; height: 100%;',
  autoFocus: true,
  audio: {
    disableWebAudio: false
  },
  scene: [LoadingScene, Level1, UIScene]
};

window.sizeChanged = () => {
  // if (window.game.isBooted) {
  //   setTimeout(() => {
  //     window.game.scale.resize(window.innerWidth, window.innerHeight);
  //     window.game.canvas.setAttribute(
  //       'style',
  //       `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`
  //     );
  //   }, 100);
  // }
};
window.onresize = () => window.sizeChanged();

export default new Game(gameConfig);
