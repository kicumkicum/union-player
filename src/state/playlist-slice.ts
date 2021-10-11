import {CaseReducer, createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Track} from 'ym-api/dist/types';
import {State} from './store';
import {
  auth as auth_,
  loadPopularTracksByArtist as loadPopularTracksByArtist_,
  loadTracksByArtists as loadTracksByArtists_,
  loadTrackUrl as loadTrackUrl_,
  loadAlbumByTrack as loadAlbumByTrack_,
  loadPlaylist as loadPlaylist_,
} from '../use-cases/playlist';

const selectArtist = (state: State) => {
    return state.playlist.activeTrack.track.artists[0];
};

const selectTrack = (state: State) => {
    return state.playlist.activeTrack.track;
};

const setTracks: CaseReducer = (state: State['playlist'], action: PayloadAction<Track[]>) => {
  state.tracks = action.payload;
};

const createPlaylistLogic = (): any => {
    return {
        loadPlaylist: createAsyncThunk('loadTracks', loadPlaylist_),
        loadTracksByArtists: createAsyncThunk('loadTracksByArtists', loadTracksByArtists_),
        loadTrackUrl: createAsyncThunk('loadTrackUrl', loadTrackUrl_),
        auth: createAsyncThunk('auth', auth_),
        loadPopularTracksByArtist: createAsyncThunk(
          'loadPopularTracksByArtist',
          async (_, thunkApi) => {
              const artist = selectArtist(thunkApi.getState() as State);
              return loadPopularTracksByArtist_(artist.id);
          }
        ),
        loadAlbumByTrack: createAsyncThunk(
          'loadAlbumByTrack',
          async (_, thunkApi) => {
              const track = selectTrack(thunkApi.getState() as State);

              return loadAlbumByTrack_(track);
          }
        ),
    };
};

const {loadPlaylist, loadTrackUrl, auth, loadPopularTracksByArtist, loadAlbumByTrack, loadTracksByArtists} = createPlaylistLogic();

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
        [loadPlaylist.fulfilled]: setTracks,
        [loadTracksByArtists.fulfilled]: setTracks,
        [loadPopularTracksByArtist.fulfilled]: setTracks,
        [loadAlbumByTrack.fulfilled]: setTracks,
        [loadTrackUrl.fulfilled]: (state, action) => {
            state.activeUrl = action.payload;
        },
        [loadTrackUrl.rejected]: (state, action) => {
            console.log('Error:', action);
        },
        [auth.fulfilled]: (state, action) => {
            const {access_token} = action.payload;
            state.token = access_token;
        },
    },
});

export const {setActiveTrack, setActiveNext, setActivePrev} = playlistSlice.actions;

export const reducer = playlistSlice.reducer;

export default {
    loadTracksByArtists,
    loadPlaylist,
    loadTrackUrl,
    auth,
    loadPopularTracksByArtist,
    loadAlbumByTrack,
};
