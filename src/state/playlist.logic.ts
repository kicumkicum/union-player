import {createAsyncThunk} from '@reduxjs/toolkit';
import YMApi from 'ym-api/dist/YMApi';
import {Track} from 'ym-api/dist/types';
import {shuffle} from '../utils/array';


export const createPlaylistLogic = (api: YMApi, config: any) => {
    const loadPlaylist = createAsyncThunk(
        'loadTracks',
        async () => {
            const feed = await api.getFeed();
            const playlistLite = feed.generatedPlaylists[0];

            const playlist = await api.getPlaylist(playlistLite.data.kind, playlistLite.data.owner.uid);

            return shuffle(playlist.tracks.map(it => ({track: it.track})))
        }
    );

    const loadTrackUrl = createAsyncThunk(
        'loadTrackUrl',
        async (track: Track) => {
            const t = await api.getTrackDownloadInfo(track.id);

            return await api.getTrackDirectLink(t[1].downloadInfoUrl);
        }
    );

    const auth = createAsyncThunk(
        'auth',
        async () => {
            const {login, password, token} = config;

            return await api.init({username: login, password, access_token: token});
        }
    );

    return {loadPlaylist, loadTrackUrl, auth};
};
