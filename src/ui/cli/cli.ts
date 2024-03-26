import * as readline from 'readline';
import {State, Store} from '../../state/store';
import {Interface} from 'readline';
import {Command, createCommands} from '../commands';
import {useEffect} from '../../utils/not-react';
import {formatTrack} from "./utils";

const createCLI = (store: Store): void => {
    new CLI(store);
};

const print = (...args: string[]) => {
    console.log(...args);
};

const log = (...args: any[]) => {
    console.log(`LOG:`, ...args);
};

const render = (state: State) => {
    // useEffect(() => {
    //     print('Last command: ', state.player.lastCommand)
    // }, [state.player.lastCommand], 4);

    useEffect(() => {
        const {track} = state.playlist.activeTrack;

        print(`Play: ${formatTrack(track)}`)
    }, [state.playlist.activeTrack], 'cli.show_playing_track');
};

const CLI = class {
    private rl: Interface;

    constructor(store: Store) {
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onReadLine = this.onReadLine.bind(this);

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

        this.getExecCommand = createCommands(store.dispatch, store);

        // readline.emitKeypressEvents(process.stdin);
        // process.stdin.setRawMode(true);

        this.handleKey();

        store.subscribe(() => {
            //@ts-ignore
            render(store.getState());
        });
    }

    private getExecCommand(command: string): [Command, (...args: any[]) => Promise<void>] {
        return [Command.PLAY_POPULAR, () => Promise.resolve()];
    }

    private async onReadLine(line: string): Promise<void> {
        const [command, ...value] = line
          // Workaround for play-url
          .replace(`https:`, ``)
          // Workaround for play-url
          .replace(`http:`, ``)
          // Workaround for readline
          .replace(/.*:/, ':')
          .substr(1)
          .split(' ');

        // TODO: Move to render and to debug
        log('line:', line)
        log('command:', command)
        log('value:', value)

        const [type, callback] = this.getExecCommand(command);

        if (callback) {
            process.stdout.clearLine(-1);
            process.stdout.moveCursor(-1, 0);

            // TODO: Move to render
            print('Command:', type);

            await callback(...value);
        }

        this.unHandleLine();
        this.handleKey();
    }

    // @ts-ignore
    private async onKeyDown(str, key) {
        const command = key.name || key.sequence;

        const {ctrl, meta, shift} = key;

        if (ctrl && command === `c`) {
            // TODO: Remove double code
            const [type, callback] = this.getExecCommand(`q`);
            if (callback) {
                // TODO: Move to render
                print('Command:', type);

                await callback();

                return;
            }
        }

        if (ctrl || meta || shift) {
            return;
        }

        if (['backspace', 'delete', 'insert'].some((it) => it === command)) {
            return;
        }

        if (command === ':') {
            process.stdout.moveCursor(1, 0);
            // process.stdout.clearLine(1)
            this.unHandleKey();
            this.handleLine();

            return;
        }

        process.stdout.clearLine(-1);
        process.stdout.moveCursor(-1, 1);

        const [type, callback] = this.getExecCommand(command);

        if (callback) {
            // TODO: Move to render
            print('Command:', type);

            await callback();

            return;
        }

        // TODO: Move to render
        print('Unhandled key:', command);
    }

    private handleLine() {
        this.rl.on('line', this.onReadLine);
    }
    private unHandleLine() {
        this.rl.removeListener('line', this.onReadLine);
    }
    private handleKey() {
        process.stdin.on('keypress', this.onKeyDown);
    }
    private unHandleKey() {
        process.stdin.removeListener('keypress', this.onKeyDown);
    }
};

export {
  createCLI,
};

// import rangeStream from 'range-stream';
// import ReadableStreamClone from 'readable-stream-clone';
