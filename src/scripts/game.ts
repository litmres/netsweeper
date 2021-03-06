import 'phaser';
import MainScene from './scenes/mainScene';
import MenuScene from './scenes/menuScene';
import PreloadScene from './scenes/preloadScene';
import { theme } from '../styles/theme';
import { syncStyles } from './utils/syncStyles';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

const config: GameConfig = {
  backgroundColor: theme.colors.dark,
  disableContextMenu: true,
  // canvas is a child of a relatively positioned div, with #menu as a sibling
  canvasStyle: `
    position: absolute;
    top: 0;
    left: 0;
  `,
  /** Sync the menu overlay with the canvas margin */
  callbacks: {
    postBoot() {
      syncStyles('menu');
    },
  },
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [PreloadScene, MenuScene, MainScene],
};

const createGame = async () => {
  return await new Phaser.Game(config);
};

export { createGame };
