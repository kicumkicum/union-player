import {StupidPlayer} from "stupid-player";
import {State as AppState} from "../state/store";
import {player} from "../singletone";

const play = async (uri: string) => {
  await player.play(await StupidPlayer.getReadStream(uri));

  return {
    uri,
    state: player.getState(),
  };
};

const pause = async () => {
  await player.pause();

  return player.getState();
};

const resume = async () => {
  await player.resume();

  return player.getState();
};

const togglePause = async () => {
  await player.togglePause();

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

export {
  play, pause, resume, toggleMute, togglePause, stop, setVolume
};
