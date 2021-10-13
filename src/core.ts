import {StupidPlayer} from 'stupid-player';
import {Store} from './state/store';
import {notReact} from './utils/not-react';
import {play, stop} from './state/player-slice.api';
import p from './state/playlist-slice';
import {setActiveTrack, setActiveNext} from './state/playlist-slice';

const {loadTrackUrl, loadPlaylist, auth, loadTracksByArtists} = p;

const {useEffect} = notReact;

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

    store.subscribe(() => {
        const state = store.getState();

        useEffect(() => {
            // store.dispatch(setActivePlaylist(0));
            store.dispatch(loadPlaylist(playlist));
        }, [state.playlist.token], 0);

        useEffect(() => {
            const {activeUrl} = state.playlist;
            // @ts-ignore
            activeUrl ? play(activeUrl) : stop();
        }, [state.playlist.activeUrl], 1);

        useEffect(() => {
            store.dispatch(setActiveTrack(state.playlist.tracks[0]));
        }, [state.playlist.tracks], 10);

        useEffect(() => {
            // TODO: Why activeTrack is null after changing?
            if (state.playlist.activeTrack) {
                store.dispatch(loadTrackUrl(state.playlist.activeTrack.track));
            }
        }, [state.playlist.activeTrack], 2);
    });

    player.on(player.EVENT_STOP, () => {
        store.dispatch(setActiveNext());
    });

    store.dispatch(auth());
};
