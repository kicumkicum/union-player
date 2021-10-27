import store from './store';
import {Artist, Track} from "ym-api/dist/types";

const selectPlaylistStore = () => {
  return store.getState().playlist;
};

const selectArtist = (): Artist => {
  return selectPlaylistStore().activeTrack.track.artists[0];
};

const selectTrack = (): Track => {
  return selectPlaylistStore().activeTrack.track;
};

export {
  selectArtist,
  selectTrack,
};
