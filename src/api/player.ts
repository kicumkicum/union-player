import {StupidPlayer} from "stupid-player";
import {State as AppState} from "../state/store";
import {player} from "../singletone";
import {IPlayer} from "./i-player";

player.on(`error`, (err) => {
  console.log(`Catch error!!!`, err);
});

const play = async (uri: string, thunkApi: any) => {
  await player.play(await StupidPlayer.getReadStream(uri));

  const {isMuted} = (thunkApi.getState() as AppState).player;

  // Workaround. Need fix restore volume in stupid-player
  if (isMuted) {
    await player.setVolume(0);
  }

  return {
    uri,
    state: player.getState(),
  };
};

const pause = async () => {
  await player.pause();

  return player.getState();
};

const resume = async (thunkApi: any) => {
  await player.resume();

  const {isMuted} = (thunkApi.getState() as AppState).player;

  // Workaround. Need fix restore volume in stupid-player
  if (isMuted) {
    await player.setVolume(0);
  }

  return player.getState();
};

const togglePause = async (thunkApi: any) => {
  await player.togglePause();

  const {isMuted} = (thunkApi.getState() as AppState).player;

  // Workaround. Need fix restore volume in stupid-player
  if (isMuted) {
    await player.setVolume(0);
  }

  return player.getState();
};

const stop = async () => {
  await player.stop();

  return player.getState();
};

const setVolume = async (value: number) => {
  // TODO: Remove that checking.
  // Workaround. Wait fix https://github.com/kicumkicum/stupid-player/issues/68
  value = Math.max(0, Math.min(100, value));

  await player.setVolume(value);

  return player.getVolume();
};

const toggleMute = async (value: number, thunkApi: any) => {
  const {isMuted, volume} = (thunkApi.getState() as AppState).player;

  if (isMuted) {
    await player.setVolume(volume);
  } else {
    await player.setVolume(0);
  }

  return !isMuted;
};

const playerApi = {
  play, pause, resume, toggleMute, togglePause, stop, setVolume
} as IPlayer;

export {playerApi};
