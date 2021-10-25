import {createCLI} from './src/ui/cli/cli';
import {createCore} from './src/core';
import store from './src/state/store';
import {player} from './src/singletone';
import {createChromecast} from './src/ui/chromecast/chromecast';

createCore(player, store);
createCLI(player, store);
createChromecast(player, store);
