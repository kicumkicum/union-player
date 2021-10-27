import {CaseReducer, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Track} from 'ym-api/dist/types';
import {State} from './store';
import {playlistApi} from '../api/playlist';
import {wrapApiByThunk} from "./thunk-wrapper";

const setTracks: CaseReducer = (state: State['playlist'], action: PayloadAction<Track[]>) => {
  state.tracks = action.payload;
};

const playlistApiWrapped = <typeof playlistApi>wrapApiByThunk(playlistApi);

const {loadPlaylist, loadTrackUrl, auth, loadPopularTracksByArtist, loadAlbumByTrack, loadTracksByArtists, search} = playlistApiWrapped;

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
        // @ts-ignore
        [loadPlaylist.fulfilled]: setTracks,
        // @ts-ignore
        [loadTracksByArtists.fulfilled]: setTracks,
        // @ts-ignore
        [loadPopularTracksByArtist.fulfilled]: setTracks,
        // @ts-ignore
        [loadAlbumByTrack.fulfilled]: setTracks,
        // @ts-ignore
        [search.fulfilled]: setTracks,
        // @ts-ignore
        [loadTrackUrl.fulfilled]: (state, action) => {
            state.activeUrl = action.payload;
        },
        // @ts-ignore
        [loadTrackUrl.rejected]: (state, action) => {
            console.log('Error:', action);
        },
        // @ts-ignore
        [auth.fulfilled]: (state, action) => {
            const {access_token} = action.payload;
            state.token = access_token;
        },
    },
});

export const {setActiveTrack, setActiveNext, setActivePrev} = playlistSlice.actions;

export const reducer = playlistSlice.reducer;

export const playlistActions = {
    setActiveTrack,
    setActiveNext,
    setActivePrev,
    loadTracksByArtists,
    loadPlaylist,
    loadTrackUrl,
    auth,
    loadPopularTracksByArtist,
    loadAlbumByTrack,
    search,
};

export default {
    loadTracksByArtists,
    loadPlaylist,
    loadTrackUrl,
    auth,
    loadPopularTracksByArtist,
    loadAlbumByTrack,
    search,
};
