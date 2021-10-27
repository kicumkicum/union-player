import {StupidPlayer} from 'stupid-player';
import {Store} from './state/store';
import {notReact} from './utils/not-react';
import {play, stop} from './state/player-slice';
import {setActiveTrack, setActiveNext, loadTrackUrl, loadPlaylist, auth} from './state/playlist-slice';

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
    const {dispatch} = store;

    store.subscribe(() => {
        const state = store.getState();

        useEffect(() => {
            // dispatch(setActivePlaylist(0));
            // dispatch(loadTracksByArtists(['СахарСоСтеклом']));
            // @ts-ignore
            dispatch(loadPlaylist(playlist));
        }, [state.playlist.token], 0);

        useEffect(() => {
            const {activeUrl} = state.playlist;
            // @ts-ignore
            activeUrl ? dispatch(play(activeUrl)) : dispatch(stop());
        }, [state.playlist.activeUrl], 1);

        useEffect(() => {
            dispatch(setActiveTrack(state.playlist.tracks[0]));
        }, [state.playlist.tracks], 10);

        useEffect(() => {
            // TODO: Why activeTrack is null after changing?
            if (state.playlist.activeTrack) {
                // @ts-ignore
                dispatch(loadTrackUrl(state.playlist.activeTrack.track));
            }
        }, [state.playlist.activeTrack], 2);
    });

    player.on(player.EVENT_STOP, () => {
        dispatch(dispatch(setActiveNext()));
    });

    // @ts-ignore
    dispatch(auth());
};
