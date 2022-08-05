import {configureStore} from '@reduxjs/toolkit'
import {reducer as playlistReducer} from './playlist-slice';
import {r as playerReducer} from './player-slice';
//@ts-ignore
import devToolsEnhancer from 'remote-redux-devtools';

const IS_DEBUG = false;

type Store = typeof store;

type State = ReturnType<typeof store.getState>;

const enhancers = [];

if (IS_DEBUG) {
  enhancers.push(devToolsEnhancer({
    suppressConnectErrors: true,
    name: 'Union Player',
    realtime: true,
    hostname: 'localhost',
    port: 8080,
  }));
}

const store = configureStore({
  reducer: {
    player: playerReducer,
    playlist: playlistReducer,
    // playlists: playlistsReducer,
  },
    devTools: true,
    enhancers,
});


export {Store, State};

export default store;
