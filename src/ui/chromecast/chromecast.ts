// @ts-ignore
import ChromecastAPI from 'chromecast-api';
import {Track} from 'ym-api/dist/types';
import {useEffect} from '../../utils/not-react';
import {State, Store} from '../../state/store';
import './patch';

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
        }, function (err: Error) {
            if (err) {
                console.log('Chromecast::Playing error', err);
            }
        });
        // @ts-ignore
    }, [state.playlist.activeUrl], 'chromecast.play_track');
};

const createChromecast = (store: Store): void => {
    const client = new ChromecastAPI();

    client.on('device', function (device_: any) {
        device = device_;
    });

    store.subscribe(() => {
        render(store.getState());
    });
};

export {createChromecast};
