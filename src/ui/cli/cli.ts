import * as readline from 'readline';
import {IStupidPlayer} from "i-stupid-player";

// enum Command {
//   PLAY = 'play',
//   PAUSE = 'pause',
//   TOGGLE_PLAY = 'toggle-play',
//   TOGGLE_MUTE = 'toggle-mute',
//   NEXT_TRACK = 'next-track',
//   PREV_TRACK = 'prev-track',
// }

// const CommandMap = {
//   [Command.NEXT_TRACK]: [],
//   [Command.PAUSE]: [],
//   [Command.PLAY]: [],
//   [Command.PREV_TRACK]: [],
//   [Command.TOGGLE_MUTE]: [],
//   [Command.TOGGLE_PLAY]: [],
// };

const createCLI = (player: IStupidPlayer): void => {
  const p = player;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', async (line: string) => {
    const [command, value] = line.split(' ');
    console.log('line:', line)

    switch (command) {
      case 'p':
        await p.togglePause();
        break;
      case 's':
      case 'n':
        await p.stop();
        break;
      case 'm': {
        const volume = p.getVolume()
        await p.setVolume(volume > 0 ? 0 : 100);
        break;
      }
      case 'v': {
        const volume = parseInt(value, 10);
        await p.setVolume(volume);
        break;
      }
    }
  });
};

export {
  createCLI,
};
