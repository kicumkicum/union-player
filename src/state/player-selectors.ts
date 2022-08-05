import store from './store';

const selectPlayerStore = () => {
  return store.getState().player;
};

const selectVolume = () => {
  return selectPlayerStore().volume;
};

const selectIsMuted = () => {
  return selectPlayerStore().isMuted;
};

export {
  selectVolume,
  selectIsMuted,
};
