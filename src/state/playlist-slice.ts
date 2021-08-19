import {createSlice} from '@reduxjs/toolkit';
import {createPlaylistLogic} from './playlist.logic';
import {YMApi} from 'ym-api';
import config from '../../config';
import {Track} from 'ym-api/dist/types';

const api = new YMApi();

const {loadPlaylist, loadTrackUrl, auth, loadPopularTracksByArtist} = createPlaylistLogic(api, config);

export const playlistSlice = createSlice({
    name: 'PLAYLIST',
    initialState: {
        activeTrack: null,
        lastCommand: 'foo',
        activeUrl: '',
        token: '',
        tracks: [],
    },
    reducers: {
        setActiveTrack(state, action: { type: string, payload: Track }) {
            state.activeTrack = action.payload;
        },

        setActiveNext(state) {
            const {tracks} = state;
            let index = 1 + tracks.findIndex((it) => it.track.id === state.activeTrack.track.id);

            if (index >= tracks.length) {
                index = 0;
            }

            state.activeTrack = tracks[index];
        },

        setActivePrev(state) {
            const {tracks} = state;
            let index = tracks.findIndex((it) => it.track.id === state.activeTrack.track.id) - 1;

            if (index < 0) {
                index = tracks.length - 1;
            }

            state.activeTrack = tracks[index];
        },
    },
    extraReducers: {
        //@ts-ignore
        [loadPlaylist.fulfilled as unknown as string]: (state, action) => {
            state.tracks = action.payload;
        },
      //@ts-ignore
      [loadPopularTracksByArtist.fulfilled as unknown as string]: (state, action) => {
          state.tracks = action.payload;
      },

     //@ts-ignore
     [loadTrackUrl.fulfilled as unknown as string]: (state, action) => {
            state.activeUrl = action.payload;
        },

      //@ts-ignore
      [auth.fulfilled as unknown as string]: (state, action) => {
            const {access_token} = action.payload;
            state.token = access_token;
        },
    },
});

export const {setActiveTrack, setActiveNext, setActivePrev} = playlistSlice.actions;

export const reducer = playlistSlice.reducer;

export default {
    //@ts-ignore
    loadPlaylist,
    //@ts-ignore
    loadTrackUrl,
    //@ts-ignore
    auth,
    //@ts-ignore
    loadPopularTracksByArtist,
};
