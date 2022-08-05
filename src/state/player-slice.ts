import {CaseReducer, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {State} from 'stupid-player';
import {playerApi} from '../api/common-player';
import {wrapApiByThunk} from './thunk-wrapper';
import {State as StoreState} from './store';

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

// @ts-ignore
const playerApiWrapped = <PlayerThunkWrapper>wrapApiByThunk(playerApi);

const setState: CaseReducer = (state: StoreState['player'], action: PayloadAction<State>): void => {
    state.state = action.payload;
};

const setURI: CaseReducer = (state: StoreState['player'], action: PayloadAction<string>): void => {
    state.uri = action.payload;
};

const setMute: CaseReducer = (state: StoreState['player'], action: PayloadAction<boolean>): void => {
    state.isMuted = action.payload;
};

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
        [playerApiWrapped.togglePause.fulfilled as unknown as string]: setState,

        // @ts-ignore
        [playerApiWrapped.toggleMute.fulfilled as unknown as string]: setMute,

        // @ts-ignore
        [playerApiWrapped.setVolume.fulfilled as unknown as string]: (state, action) => {
            const volume = action.payload;

            state.volume = volume;
            state.isMuted = false;
        },

        // @ts-ignore
        [playerApiWrapped.stop.fulfilled as unknown as string]: setState,

        // @ts-ignore
        [playerApiWrapped.play.fulfilled as unknown as string]: (state, action) => {
            const {uri, state: playerState} = action.payload;

            setState(state, {payload: playerState, type: ''});
            setURI(state, {payload: uri, type: ''});
        },

        // @ts-ignore
        [playerApiWrapped.play.rejected]: (state, action) => {
            // TODO: Move to logger and enable/disable
            console.log('Error:', action);
        }
    }
});


const r = playerSlice.reducer;
const {togglePause, stop, play, toggleMute, setVolume} = playerApiWrapped;

//@ts-ignore
export {togglePause, stop, play, toggleMute, setVolume, r};

export default {togglePause, stop, play, toggleMute, setVolume};
