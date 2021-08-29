import {createCLI} from './src/ui/cli/cli';
import {createCore} from './src/core';
import store from './src/state/store';
import {player} from './src/singletone';

createCore(player, store);
createCLI(player, store);
