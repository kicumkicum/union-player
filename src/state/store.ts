import {configureStore} from '@reduxjs/toolkit'
import counterReducer from "./counter-slice";
import playlistReducer from './playlist-slice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    playlist: playlistReducer,
  },
});
