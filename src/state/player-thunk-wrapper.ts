import {State, StupidPlayer} from 'stupid-player';
import {AsyncThunkPayloadCreator, createAsyncThunk} from '@reduxjs/toolkit';
import {
  toggleMute as toggleMute_,
  togglePause as togglePause_,
  pause as pause_,
  resume as resume_,
  play as play_,
  stop as stop_,
  setVolume as setVolume_
} from '../use-cases/player';

interface PlayerThunkWrapper {
  play: () => AsyncThunkPayloadCreator<{
    uri: string,
    state: State,
  }, string>;
  pause: () => State;
  resume: () => State;
  togglePause: () => State;
  stop: () => State;
  setVolume: (volume: number) => number;
  toggleMute: () => boolean;
}

export const createPlayerThunkWrapper = (player: StupidPlayer): PlayerThunkWrapper => {
  const play = createAsyncThunk('play', play_);
  const pause = createAsyncThunk('pause', pause_);
  const resume = createAsyncThunk('resume', resume_);
  const togglePause = createAsyncThunk('togglePause', togglePause_);
  const stop = createAsyncThunk('stop', stop_);
  const setVolume = createAsyncThunk('setVolume', setVolume_);
  const toggleMute = createAsyncThunk('toggleMute', toggleMute_);

  return {
    // @ts-ignore
    play, pause, resume, togglePause, stop, setVolume, toggleMute,
  };
};
