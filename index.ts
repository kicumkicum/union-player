import {createCLI} from './src/ui/cli/cli';
import {createCore} from './src/core';
import store from './src/state/store';
import {player} from './src/singletone';
import {createChromecast} from './src/ui/chromecast/chromecast';
import {createTelegram} from './src/ui/telegram/telegram';
import {name} from './package.json';
import {createWeb} from './src/ui/web/web';

const UI = {
  'chromecast': createChromecast,
  'telegram': createTelegram,
  'web': createWeb,
  'cli': createCLI,
};

type Command = 'playlist' | 'ui';
type Args = {[key in `--${Command}`]: string};

const parseArgs = (): Args => {
  return process.argv.slice(2).reduce((acc, cur, i, arr) => {
    let key, val;

    if (cur.startsWith('--')) {
      key = cur;
    } else {
      val = cur;
      key = arr[i - 1];
    }

    return {
      ...acc,
      [key]: val,
    }
  }, {} as Args);
};

const configureProcess = () => {
  process.title = name;
  process.on('SIGTERM', () => {
    process.exit();
  });
  process.on('SIGINT', () => {
    process.exit();
  });
};

configureProcess();
createCore(player, store);

const UIs = (parseArgs()['--ui'] || '').split(',') as (keyof typeof UI)[];

// @ts-ignore
if (UIs.length === 1 && UIs.includes('')) {
  UIs.length = 0;
  UIs.push('cli');
}

UIs.forEach((ui) => UI[ui](store));
