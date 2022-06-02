import {StupidPlayer} from 'stupid-player';
import {Store} from './state/store';
import {useEffect} from './utils/not-react';
import {play, stop} from './state/player-slice';
import {setActiveTrack, setActiveNext, loadTrackUrl, loadPlaylist, auth, loadTracksByArtists} from './state/playlist-slice';

type Command = 'playlist';
type Args = {[key in `--${Command}`]: string};

const parseArgs = (): Args => {
    return process.argv.slice(2).reduce((acc, cur, i, arr) => {
        let key, val;

        if (cur.startsWith('--')) {
            key = cur;
        } else {
            val = cur;
            key = arr[i - 1];
        }

        return {
            ...acc,
            [key]: val,
        }
    }, {} as Args);
};

export const createCore = (player: StupidPlayer, store: Store) => {
    const playlist = parseArgs()['--playlist'];
    const {dispatch} = store;

    store.subscribe(() => {
        const state = store.getState();

        useEffect(() => {
            // dispatch(setActivePlaylist(0));
            // @ts-ignore
            // dispatch(loadTracksByArtists(['Валентин Стрыкало']));
            // @ts-ignore
            dispatch(loadPlaylist(playlist));
        }, [state.playlist.token], 'core.load_playlist');

        useEffect(() => {
            const {activeUrl} = state.playlist;
            // @ts-ignore
            activeUrl ? dispatch(play(activeUrl)) : dispatch(stop());
        }, [state.playlist.activeUrl], 'core.play_track');

        useEffect(() => {
            dispatch(setActiveTrack(state.playlist.tracks[0]));
        }, [state.playlist.tracks], 'core.set_active_track');

        useEffect(() => {
            // TODO: Why activeTrack is null after changing?
            if (state.playlist.activeTrack) {
                // @ts-ignore
                dispatch(loadTrackUrl(state.playlist.activeTrack.track));
            }
        }, [state.playlist.activeTrack], 'core.load_track_url');
    });

    player.on(player.EVENT_STOP, () => {
        dispatch(setActiveNext());
    });

    player.on(player.EVENT_ERROR, (err) => {
        console.log('Error handler', err);
        dispatch(setActiveNext());
    });

    // @ts-ignore
    dispatch(auth());
};
