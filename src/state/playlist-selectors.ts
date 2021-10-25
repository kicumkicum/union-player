import store from './store';
import {Track} from "ym-api/dist/types";

const selectPlaylistStore = () => {
  return store.getState().playlist;
};

const selectArtist = () => {
  return selectPlaylistStore().activeTrack.track.artists[0];
};

const selectTrack = (): Track => {
  return selectPlaylistStore().activeTrack.track;
};

export {
  selectArtist,
  selectTrack,
};
