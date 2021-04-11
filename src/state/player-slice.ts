// import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// import {State} from "stupid-player";
// // import player from '../../index';
//
// const pause = createAsyncThunk(
//   'users/fetchByIdStatus',
//   async () => {
//     await player.pause();
//
//     return State.PAUSE;
//   }
// );
//
// export const playerSlice = createSlice({
//     name: 'player',
//     initialState: {
//         state: State.STOP,
//         volume: 100,
//         isMuted: false,
//         uri: '',
//     },
//     reducers: {
//         setState(state, action) {
//             state.state = action.payload;
//         },
//         setVolume(track, position) {
//         },
//         removeTrack(track) {
//         },
//     },
//     extraReducers: {
//         // Add reducers for additional action types here, and handle loading state as needed
//         [pause.fulfilled as unknown as string]: (state, action) => {
//             state.state = action.payload;
//         }
//     }
// });
//
// //@ts-ignore
// export const {addTrack, removeTrack, setActiveTrack} = playerSlice.actions;
//
// export default playerSlice.reducer;
