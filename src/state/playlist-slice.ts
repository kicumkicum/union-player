import {createSlice} from '@reduxjs/toolkit';
import {isBoolean} from "util";

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState: {
    activeTrack: 0,
    tracks: [
      {
        url: '',
      }, {
        url: ''
      }
    ],
  },
  reducers: {
    setActiveTrack(state, action: {type: string, payload: number}) {
      state.activeTrack = action.payload;
    },
    addTrack(track, position) {
    },
    removeTrack(track) {
    },
  },
});

export const {addTrack, removeTrack, setActiveTrack} = playlistSlice.actions;

export default playlistSlice.reducer;
