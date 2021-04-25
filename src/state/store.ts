import {configureStore} from '@reduxjs/toolkit'
import {reducer as playlistReducer} from './playlist-slice';
import {r as playerReducer} from './player-slice';
//@ts-ignore
import devToolsEnhancer from 'remote-redux-devtools';

type Store = typeof store;

type State = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: {
    playlist: playlistReducer,
    player: playerReducer,
  },
    devTools: true,
    enhancers: [devToolsEnhancer({
        name: 'Android app', realtime: true,
        hostname: 'localhost', port: 8080,
    })]
});


export {Store, State};

export default store;
