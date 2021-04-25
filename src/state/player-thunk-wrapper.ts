import {State, StupidPlayer} from 'stupid-player';
import {AsyncThunkPayloadCreator, createAsyncThunk} from '@reduxjs/toolkit';
import {State as AppState} from './store';

interface PlayerThunkWrapper {
    play: () => AsyncThunkPayloadCreator<{
        uri: string,
        state: State,
    }, string>;
    pause: () => State;
    resume: () => State;
    togglePause: () => State;
    stop: () => State;
    setVolume: () => number;
    toggleMute: () => boolean;
}

export const createPlayerThunkWrapper = (player: StupidPlayer): PlayerThunkWrapper => {
    const play = createAsyncThunk(
        'play',
        async (uri: string) => {
            await player.play(await StupidPlayer.getReadStream(uri));

            return {
                uri,
                state: player.getState(),
            };
        }
    );

    const pause = createAsyncThunk(
        'pause',
        async () => {
            await player.pause();

            return player.getState();
        }
    );

    const resume = createAsyncThunk(
        'resume',
        async () => {
            await player.resume();

            return player.getState();
        }
    );

    const togglePause = createAsyncThunk(
        'togglePause',
        async () => {
            await player.togglePause();

            return player.getState();
        }
    );

    const stop = createAsyncThunk(
        'stop',
        async () => {
            await player.stop();

            return player.getState();
        }
    );

    const setVolume = createAsyncThunk(
        'setVolume',
        async (value: number) => {
            await player.setVolume(value);

            return player.getVolume();
        }
    );

    const toggleMute = createAsyncThunk(
        'toggleMute',
        async (value: number, thunkApi) => {
            const {isMuted, volume} = (thunkApi.getState() as AppState).player;

            if (isMuted) {
                await player.setVolume(volume);
            } else {
                await player.setVolume(0);
            }

            return !isMuted;
        }
    );

    return {
        // @ts-ignore
        play, pause, resume, togglePause, stop, setVolume, toggleMute,
    };
};
