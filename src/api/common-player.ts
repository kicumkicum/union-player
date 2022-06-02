// @ts-nocheck
import {playerApi as nativePlayer} from "./player";
import {api as chromecastPlayer} from './chromecast-player';
import {IPlayer} from "./i-player";

let activePlayer = nativePlayer;

const players = [
  chromecastPlayer,
  nativePlayer,
];

const createCommonPlayer = (players: IPlayer[]): !IPlayer => {
  return Object.keys(players[0]).reduce((acc, cur): IPlayer => {
    return {
      ...acc,
      [cur]: (...args: Parameters<IPlayer[cur]>): ReturnType<IPlayer[cur]> => {
        return Promise.all(players.map((player) => player[cur](...args)));
      }
    };
  }, {} as IPlayer);
};

const setActivePlayer = (activePlayer_: IPlayer) => {
  activePlayer = activePlayer_;
};

const playerApi = createCommonPlayer(players);

export {playerApi, setActivePlayer};
