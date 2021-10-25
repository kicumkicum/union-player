import {StupidPlayer} from 'stupid-player';
// @ts-ignore
import ChromecastAPI from 'chromecast-api';
import {Track} from 'ym-api/dist/types';
import {notReact} from '../../utils/not-react';
import {State, Store} from '../../state/store';
import './patch';

const {useEffect} = notReact;

const getTrackSrc = (track: Track, size: number) => {
    if (!track.coverUri) {
        return ``;
    }

    return `https://${track.coverUri.replace('%%', `${size}x${size}`)}`
};

let device: any = null;

const render = (state: State) => {
    useEffect(() => {
        if (!device) {
            return;
        }

        const {activeUrl, activeTrack: {track}} = state.playlist;

        // @ts-ignore
        device.play({
            url: activeUrl,
            cover: {
                title: `${track.title}`,
                url: getTrackSrc(track, 400),
            },
            // @ts-ignore
        }, function (err) {
            if (!err)
                console.log('Playing in your chromecast');
        });
        // @ts-ignore
    }, [state.playlist.activeUrl], 4589);
};

const createChromecast = (player: StupidPlayer, store: Store): void => {
    const client = new ChromecastAPI();

    client.on('device', function (device_: any) {
        device = device_;
    });

    store.subscribe(() => {
        render(store.getState());
    });
};

export {createChromecast};
