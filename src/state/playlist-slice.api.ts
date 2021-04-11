import store from './store';
import {addTrack as addTrack_, playlistSlice as playlistSlice_, removeTrack as removeTrack_, setActiveTrack as setActiveTrack_} from './playlist-slice';

const setActiveTrack = (v: Parameters<typeof setActiveTrack_>[0]) => {
    store.dispatch(setActiveTrack_(v));
};


export {setActiveTrack};
