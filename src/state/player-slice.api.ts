import store from './store';
import p from './player-slice';

//
// const togglePause = (...args: Parameters<typeof togglePause_>) => {
//     store.dispatch(togglePause_(...args));
// };

type KK = {
    [K in keyof typeof p]: (...args: Parameters<typeof p[K]>) => void
};

const k: KK = {} as KK;

Object.keys(p).forEach((key: keyof typeof p) => {
    const it = p[key];

    k[key] = (...args: Parameters<typeof it>) => {
        //@ts-ignore
        store.dispatch(it(...args));
    };
});


export const {togglePause, stop, play, toggleMute} = k;
