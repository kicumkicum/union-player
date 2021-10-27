import {createSlice} from '@reduxjs/toolkit';
import {State} from 'stupid-player';
import {playerApi} from '../api/player';
import {wrapApiByThunk} from './thunk-wrapper';

interface PlayerThunkWrapper {
    play: (uri: string) => {
        uri: string,
        state: State,
    };
    pause: () => State;
    resume: () => State;
    togglePause: () => State;
    stop: () => State;
    setVolume: (volume: number) => number;
    toggleMute: () => boolean;
}

const playerApiWrapped = <PlayerThunkWrapper>wrapApiByThunk(playerApi);

export const playerSlice = createSlice({
    name: 'player',
    initialState: {
        state: State.STOP,
        volume: 100,
        isMuted: false,
        uri: '',
    },
    reducers: {},
    extraReducers: {
        // @ts-ignore
        [playerApiWrapped.togglePause.fulfilled as unknown as string]: (state, action) => {
            state.state = action.payload;
        },

        // @ts-ignore
        [playerApiWrapped.toggleMute.fulfilled as unknown as string]: (state, action) => {
            state.isMuted = action.payload;
        },

        // @ts-ignore
        [playerApiWrapped.setVolume.fulfilled as unknown as string]: (state, action) => {
            const volume = action.payload;

            state.volume = volume;
            state.isMuted = false;
        },

        // @ts-ignore
        [playerApiWrapped.stop.fulfilled as unknown as string]: (state, action) => {
            state.state = action.payload;
        },

        // @ts-ignore
        [playerApiWrapped.play.fulfilled as unknown as string]: (state, action) => {
            const {uri, state: playerState} = action.payload;

            state.state = playerState;
            state.uri = uri;
        },
    }
});


const r = playerSlice.reducer;
const {togglePause, stop, play, toggleMute, setVolume} = playerApiWrapped;

//@ts-ignore
export {togglePause, stop, play, toggleMute, setVolume, r};

export default {togglePause, stop, play, toggleMute, setVolume};
