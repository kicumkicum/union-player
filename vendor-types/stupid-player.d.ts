declare module 'stupid-player' {
    /// <reference types="node" />
    import EventEmitter from "events";
    import {IStupidPlayer, State} from "i-stupid-player";
    export default class StupidPlayer extends EventEmitter implements IStupidPlayer {
        private decoder;
        private mpg123Util;
        private offset;
        private offsetInterval;
        private readStream;
        private pauseTimestamp;
        private state;
        private router;
        private readonly VOLUME_CHANGE_TIMEOUT;
        readonly EVENT_ERROR: string;
        readonly EVENT_PAUSE: string;
        readonly EVENT_PLAY: string;
        readonly EVENT_STOP: string;
        readonly EVENT_VOLUME_CHANGE: string;
        constructor();
        play(uri: any): Promise<void>;
        pause(): Promise<undefined>;
        resume(): Promise<undefined>;
        togglePause(): Promise<undefined>;
        stop(): Promise<undefined>;
        getVolume(): (number | null);
        getOffset(): number;
        setVolume(value: any): Promise<number>;
        getState(): State;
        private makeDecoder;
        private deinit;
        private _emit;
        private onDecoderClosed;
        private onError;
    }
}