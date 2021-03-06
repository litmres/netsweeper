/** @jsx jsx **/
import { jsx, css } from '@emotion/core';
import { useEffect, useState } from 'react';
import { withTheme } from 'emotion-theming';
import { GameEvents } from '../scripts/events';
import spinthink from '../assets/spinthink.gif';
import gasp from '../assets/gasp.png';
import dead from '../assets/dead.png';
import win from '../assets/win.png';
import { Theme } from '../styles/theme';
import { shadow } from './Button';

export interface EmojiConfig {
  height: number;
  scale: number;
  x: number;
}

interface EmojiProps {
  game: Phaser.Game;
  theme: Theme;
  config: EmojiConfig;
}

interface Emoji {
  alt: string;
  src: string;
  text?: string;
}

// Preload images
new Image().src = spinthink;
new Image().src = gasp;
new Image().src = dead;
new Image().src = win;

const emojis = {
  think: {
    alt: 'spinning thinking emoji',
    src: spinthink,
  },
  gasp: {
    alt: 'gasping emoji',
    src: gasp,
  },
  dead: {
    alt: 'dizzy face emoji',
    src: dead,
    text: 'You lose!',
  },
  win: {
    alt: 'cool emoji',
    src: win,
    text: 'You win!',
  },
};

function Emoji({ game, theme, config: { height, scale, x } }: EmojiProps) {
  /** This is also the width since original is square */
  const scaledHeight = height * scale;
  const half = scaledHeight / 2;

  const [emoji, setEmoji] = useState<Emoji>(emojis.think);

  useEffect(() => {
    game.events.on(GameEvents.EMOJI_GASP, () => setEmoji(emojis.gasp));
    game.events.on(GameEvents.EMOJI_THINK, () => setEmoji(emojis.think));
    game.events.on(GameEvents.EMOJI_DEAD, () => setEmoji(emojis.dead));
    game.events.on(GameEvents.EMOJI_WIN, () => setEmoji(emojis.win));

    return () => {
      game.events.off(GameEvents.EMOJI_GASP);
      game.events.off(GameEvents.EMOJI_THINK);
      game.events.off(GameEvents.EMOJI_DEAD);
      game.events.off(GameEvents.EMOJI_WIN);
    };
  }, [game]);

  const { text, ...emojiProps } = emoji;

  return (
    <div
      css={css`
        position: absolute;
        top: ${75 * scale - half}px;
        left: ${x - half}px;
        width: ${scaledHeight}px;
        color: #fff;
        font-size: ${0.5 * scale}rem;
        text-align: center;
      `}
    >
      <img
        css={css`
          pointer-events: all;
          cursor: pointer;
          height: ${scaledHeight}px;
          border-radius: 50%;
          transition: box-shadow 100ms ease-in;

          &:hover {
            box-shadow: 0 0 16px 2px ${shadow({ color: 'red', theme })},
              0 0 32px 0 ${shadow({ color: 'red', theme })} inset;
          }
        `}
        onClick={() => game.events.emit(GameEvents.RESTART)}
        {...emojiProps}
      />
      {text && <p>{text}</p>}
    </div>
  );
}

export default withTheme(Emoji);
