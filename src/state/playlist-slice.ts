import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Track} from 'ym-api/dist/types';
import {State} from './store';
import {
    auth as auth_,
    loadPopularTracksByArtist as loadPopularTracksByArtist_,
    loadTrackUrl as loadTrackUrl_,
    loadPlaylist as loadPlaylist_
} from '../use-cases/playlist';

const selectArtist = (state: State) => {
    return state.playlist.activeTrack.track.artists[0];
};

const createPlaylistLogic = (): any => {
    return {
        loadPlaylist: createAsyncThunk('loadTracks', loadPlaylist_),
        loadTrackUrl: createAsyncThunk('loadTrackUrl', loadTrackUrl_),
        auth: createAsyncThunk('auth', auth_),
        loadPopularTracksByArtist: createAsyncThunk(
          'loadPopularTracksByArtist',
          async (_, thunkApi) => {
              const artist = selectArtist(thunkApi.getState() as State);
              return loadPopularTracksByArtist_(artist.id);
          }
        ),
    };
};

const {loadPlaylist, loadTrackUrl, auth, loadPopularTracksByArtist} = createPlaylistLogic();

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
