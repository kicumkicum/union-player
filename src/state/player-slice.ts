import {createSlice} from '@reduxjs/toolkit';
import {State} from 'stupid-player';
import {createPlayerThunkWrapper} from './player-thunk-wrapper';
import {getPlayer} from '../player';

const player = getPlayer();

const {togglePause, stop, play, toggleMute} = createPlayerThunkWrapper(player);

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
        [togglePause.fulfilled as unknown as string]: (state, action) => {
            state.state = action.payload;
        },

        // @ts-ignore
        [toggleMute.fulfilled as unknown as string]: (state, action) => {
            state.isMuted = action.payload;
        },

        // @ts-ignore
        [stop.fulfilled as unknown as string]: (state, action) => {
            state.state = action.payload;
        },

        // @ts-ignore
        [play.fulfilled as unknown as string]: (state, action) => {
            const {uri, state: playerState} = action.payload;

            state.state = playerState;
            state.uri = uri;
        },
    }
});

const r = playerSlice.reducer;
//@ts-ignore
export {togglePause, r}

export default {togglePause, stop, play, toggleMute};
