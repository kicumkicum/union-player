import {createCLI} from './src/ui/cli/cli';
import {createCore} from './src/core';
import store from './src/state/store';
import {getPlayer} from './src/player';

const player = getPlayer();

createCore(player, store);
createCLI(player, store);
