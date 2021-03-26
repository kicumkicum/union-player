declare module 'i-stupid-player' {
    /// <reference types="node" />
    import { EventEmitter } from 'events';
    export interface IStupidPlayer extends EventEmitter {
        /**
         * Fired with: {number} volume
         */
        readonly EVENT_VOLUME_CHANGE: string;
        /**
         * Fired with: {string}
         */
        readonly EVENT_ERROR: string;
        readonly EVENT_PLAY: string;
        readonly EVENT_PAUSE: string;
        readonly EVENT_STOP: string;
        play(url: string): Promise<void>;
        pause(): Promise<undefined>;
        resume(): Promise<undefined>;
        togglePause(): Promise<undefined>;
        stop(): Promise<undefined>;
        getVolume(): number | null;
        setVolume(value: number): Promise<number>;
        getState(): State;
    }
    export enum State {
        PAUSE = 0,
        PLAY = 1,
        STOP = 2
    }
}