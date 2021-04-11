import {configureStore} from '@reduxjs/toolkit'
import counterReducer from "./counter-slice";
import playlistReducer from './playlist-slice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    playlist: playlistReducer,
  },
});


type Store = typeof store;

export default store;

export {Store};
