import {IPlayer, State} from "./i-player";
import {State as AppState} from "../state/store";
import {chromecastDevice} from "../singletone";
// import {selectTrack} from "../state/playlist-selectors";
import {Track} from "ym-api/dist/types";

const getTrackSrc = (track: Track, size: number) => {
  if (!track.coverUri) {
    return ``;
  }

  // TODO: May be url is not correct
  return `https://${track.coverUri.replace('%%', `${size}x${size}`)}`
};


const play = async (uri: string, thunkApi: any) => {
  // const track = selectTrack();

  await chromecastDevice.play({
    url: uri,
    cover: {
      title: `foo`,
      // url: getTrackSrc(track, 400),
    },
  });

  return {
    uri,
    state: State.PLAY,
  };
};

const pause = async () => {
  await chromecastDevice.pause();

  return chromecastDevice.getState();
};

const resume = async () => {
  await chromecastDevice.resume();

  return chromecastDevice.getState();
};

const togglePause = async () => {
  const state = chromecastDevice.getState();

  if (state === State.PAUSE || state === State.STOP) {
    return await resume();
  }

  if (state === State.PLAY) {
    return await pause();
  }

  return chromecastDevice.getState();
};

const stop = async () => {
  await chromecastDevice.stop();

  return chromecastDevice.getState();
};

const setVolume = async (value: number) => {
  // TODO: Remove that checking.
  // Workaround. Wait fix https://github.com/kicumkicum/stupid-player/issues/68
  value = Math.max(0, Math.min(100, value));

  await chromecastDevice.setVolume(value);

  return value;
};

const toggleMute = async (value: number, thunkApi: any) => {
  const {isMuted, volume} = (thunkApi.getState() as AppState).player;

  if (isMuted) {
    await chromecastDevice.setVolume(volume);
  } else {
    await chromecastDevice.setVolume(0);
  }

  return !isMuted;
};

const api: IPlayer = {
  play, pause, resume, toggleMute, togglePause, stop, setVolume
};

export {api};

export {
  play, pause, resume, toggleMute, togglePause, stop, setVolume
};
