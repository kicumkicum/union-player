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

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', async (str, key) => {
    // const [command, value] = line.split(' ');
    // console.log('keypress')
    const command = key.name;
    const value = '1'
    console.log(key)
    // console.log('line:', line)

    switch (command) {
      case 'p':
        await p.togglePause();
        process.stdout.moveCursor(0,-1);
        process.stdout.clearLine(0)
        // process.stdout.clearLine(0)
        break;
      case 's':
      case 'n':
      case 'right':
        await p.stop();
        process.stdout.clearLine(0)
        process.stdout.moveCursor(-1,0);
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
      case 'up':
    }
  });

  return;
  rl.on('line', async (line: string) => {
    const [command, value] = line.split(' ');
    // console.log('line:', line)

    switch (command) {
      case 'p':
        await p.togglePause();
        process.stdout.moveCursor(0,-1);
        process.stdout.clearLine(0)
        // process.stdout.clearLine(0)
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
